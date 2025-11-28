import { Api } from '@/api/Api';
import { app } from '@/app';
import { getSingleton } from '@/utils/ioc';
import {
  createUrl,
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
  toBoolean,
  toError,
} from 'fluxio';
import { getUrlParams } from 'fluxio';

export type RoutePage = '' | 'dashboard' | 'members' | 'devices' | 'medias' | 'edit' | 'view';

export interface Route {
  group?: string;
  page?: RoutePage;
  media?: string;
}

export class Router {
  log = logger('Router');

  api = getSingleton(Api);

  url$ = flux('');
  route$ = flux<Route>({});

  page$ = this.route$.map(r => r.page);

  groupKey$ = fluxStored<string>('groupKey', 'demo', isString);
  mediaKey$ = this.route$.map(r => r.media);
  deviceKey$ = flux<string>('');

  search$ = flux<string>('');

  group$ = fluxCombine(this.groupKey$, this.api.group.up$).map(([key]) => this.api.group.get([{ key }, { id: key }]));
  media$ = fluxCombine(this.mediaKey$, this.api.media.up$).map(([key]) => this.api.media.get([{ key }, { id: key }]));
  device$ = fluxCombine(this.deviceKey$, this.api.device.up$).map(([key]) => this.api.device.get([{ key }, { id: key }]));

  isKiosk$ = fluxStored<boolean>('isKiosk', false, isBoolean);
  isAdvanced$ = fluxStored<boolean>('isAdvanced', false, isBoolean);
  groupId$ = this.group$.map(g => g?.id||'');
  mediaId$ = this.media$.map(m => m?.id||'');
  deviceId$ = this.device$.map(d => d?.id||'');

  constructor() {
    app.router = this;
    this.route$.isEqual = isDeepEqual;

    this.url$.on(url => {
      const p = getUrlParams(url);
      const s = (p.path || '').split('/').filter((s) => s);

      const group = p.group || s[0] || this.groupKey$.get();
      const page = p.page as RoutePage || s[1] as RoutePage || this.page$.get();
      const media = p.media || s[2] || this.mediaKey$.get();

      if (isDefined(p.kiosk)) this.isKiosk$.set(isEmpty(p.kiosk) || toBoolean(p.kiosk));
      if (isDefined(p.advanced)) this.isAdvanced$.set(isEmpty(p.advanced) || toBoolean(p.advanced));

      const route: Route = {
        group,
        page,
        media,
      };

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

    const segments = media ? [group, page, media] : page ? [group, page] : group ? [group] : [];
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