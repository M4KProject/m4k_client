import { Api } from '@/api/Api';
import { Sync } from '@/api/sync';
import { app } from '@/app';
import { getSingleton } from '@/utils/ioc';
import {
  createUrl,
  Flux,
  flux,
  fluxCombine,
  fluxStored,
  glb,
  isBoolean,
  isDeepEqual,
  isDefined,
  isEmpty,
  isString,
  isStringValid,
  logger,
  onEvent,
  Pipe,
  toBoolean,
  toError,
} from 'fluxio';
import { getUrlParams } from 'fluxio';
import { PbModel } from 'pblite';

export type RoutePage = '' | 'dashboard' | 'members' | 'devices' | 'medias' | 'edit' | 'view';

export interface Route {
  page?: RoutePage;
  group?: string;
  media?: string;
  device?: string;
}

const routerItem = (key$: Pipe<string, Route>, id$: Flux<string>, up$: Flux, sync: Sync<PbModel & { key?: string }>) => (
  fluxCombine(key$, id$, up$).map(([key, id]) => {
    console.debug('routerItem', sync.name, key, id);
    const keyItem = sync.get([{ key }, { id: key }]);
    console.debug('routerItem keyItem', sync.name, keyItem?.id, keyItem?.key);
    const idItem = sync.get(id);
    console.debug('routerItem idItem', sync.name, idItem?.id, idItem?.key);
    const item = keyItem || idItem;
    console.debug('routerItem item', sync.name, item?.id, item?.key);
    const itemId = item?.id || '';
    setTimeout(() => id$.set(itemId), 0);
    return item;
  })
)

export class Router {
  log = logger('Router');

  api = getSingleton(Api);

  url$ = flux('');
  route$ = flux<Route>({});
  search$ = flux<string>('');

  groupId$ = fluxStored<string>('groupId', '', isString);
  mediaId$ = fluxStored<string>('mediaId', '', isString);
  deviceId$ = fluxStored<string>('deviceId', '', isString);

  group$ = routerItem(this.route$.map(r => r.group||''), this.groupId$, this.api.group.up$, this.api.group);
  media$ = routerItem(this.route$.map(r => r.media||''), this.mediaId$, this.api.media.up$, this.api.media);
  device$ = routerItem(this.route$.map(r => r.device||''), this.deviceId$, this.api.device.up$, this.api.device);
  
  isKiosk$ = fluxStored<boolean>('isKiosk', false, isBoolean);
  isAdvanced$ = fluxStored<boolean>('isAdvanced', false, isBoolean);

  constructor() {
    app.router = this;
    this.route$.isEqual = isDeepEqual;

    this.url$.on((url) => {
      const p = getUrlParams(url);
      const s = (p.path || '').split('/').filter((s) => s);
      const last = this.route$.get();

      const page = (p.page as RoutePage) || (s[1] as RoutePage) || last.page;
      const group = p.group || s[0] || last.group;
      const media = p.media || s[2] || last.media;
      const device = p.device || last.device;

      if (isDefined(p.kiosk)) this.isKiosk$.set(isEmpty(p.kiosk) || toBoolean(p.kiosk));
      if (isDefined(p.advanced)) this.isAdvanced$.set(isEmpty(p.advanced) || toBoolean(p.advanced));

      const route: Route = { group, page, media, device };

      this.log.d('parse', route);

      this.route$.set(route);
    });

    if (glb.window) {
      const sync = () => this.url$.set(glb.location?.href);
      onEvent(glb.window, 'hashchange', sync);
      onEvent(glb.window, 'popstate', sync);
      sync();
    }
  }

  getGroupId() {
    return this.group$.get()?.id;
  }

  needGroupId() {
    const id = this.getGroupId();
    if (!isStringValid(id)) throw toError('no group id');
    return id;
  }

  goUrl(url: string) {
    this.log.i('goUrl', url);

    glb.history?.pushState(null, '', url);
    this.url$.set(url);
  }

  go(changes: Partial<Route>) {
    this.log.d('go', changes);

    const current = this.route$.get();
    const route = { ...current, ...changes };

    const { group, page, media } = route;
    const isKiosk = this.isKiosk$.get();
    const isAdvanced = this.isAdvanced$.get();

    const segments =
      media ? [group, page, media]
      : page ? [group, page]
      : group ? [group]
      : [];
    const path = `/${segments.join('/')}`;

    console.debug('go path', path);

    const url = createUrl(null, path, {
      kiosk: isKiosk || undefined,
      advanced: isAdvanced || undefined,
    });

    this.log.d('go url', url);

    this.goUrl(url);
  }

  back() {
    this.log.d('back');
    glb.history?.back();
  }
}
