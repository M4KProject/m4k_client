import { api2 } from '@/api2';
import { app } from '@/app';
import {
  createUrl,
  flux,
  fluxStored,
  glb,
  isBoolean,
  isDefined,
  isEmpty,
  isNotNil,
  isVector2,
  logger,
  onEvent,
  toBoolean,
  Vector2,
} from 'fluxio';
import { getUrlParams } from 'fluxio';

export type RoutePage = '' | 'dashboard' | 'members' | 'devices' | 'medias' | 'edit' | 'view';

export interface Route {
  page?: RoutePage;
  group?: string;
  media?: string;
  device?: string;
  kiosk?: boolean;
  advanced?: boolean;
}

export class Router {
  log = logger('Router');

  url$ = flux('');
  page$ = flux<RoutePage>('');
  search$ = flux<string>('');
  isKiosk$ = fluxStored<boolean>('isKiosk', false, isBoolean);
  isAdvanced$ = fluxStored<boolean>('isAdvanced', false, isBoolean);
  screenSize$ = fluxStored<Vector2>('screenSize', [1920, 1080], isVector2);

  constructor() {
    app.router = this;

    this.url$.on((url) => {
      this.log.d('url', url);

      const page$ = this.page$;
      const search$ = this.search$;
      const groupId$ = api2.groups.id$;
      const mediaId$ = api2.medias.id$;
      const deviceId$ = api2.devices.id$;

      const p = getUrlParams(url);
      const s = (p.path || '').split('/');

      const page = (s[2] || p.page || page$.get()) as RoutePage;
      const search = p.search || search$.get();
      const group = s[1] || p.group || groupId$.get();
      const media = s[3] || p.media || mediaId$.get();
      const device = p.device || deviceId$.get();

      const groupId = api2.groups.getIdByKey(group);
      const mediaId = api2.groups.getIdByKey(media);
      const deviceId = api2.groups.getIdByKey(device);

      this.log.d('url parse', { p, s, page, search, group, media, device, groupId, mediaId, deviceId });
      
      page$.set(page);
      search$.set(search);
      groupId$.set(groupId);
      mediaId$.set(mediaId);
      deviceId$.set(deviceId);

      if (isDefined(p.kiosk)) this.isKiosk$.set(isEmpty(p.kiosk) || toBoolean(p.kiosk));
      if (isDefined(p.advanced)) this.isAdvanced$.set(isEmpty(p.advanced) || toBoolean(p.advanced));
    });

    if (glb.window) {
      const sync = () => this.url$.set(glb.location?.href);
      onEvent(glb.window, 'hashchange', sync);
      onEvent(glb.window, 'popstate', sync);
      sync();
    }
  }

  private goUrl(url: string) {
    this.log.i('goUrl', url);

    glb.history?.pushState(null, '', url);
    this.url$.set(url);
  }

  go(route: Route) {
    this.log.d('go', route);

    const page = route.page || this.page$.get();
    const group = route.group || api2.groups.item$.get()?.key;
    const media = route.media || api2.medias.item$.get()?.key;
    const device = route.device || api2.devices.item$.get()?.key;

    const kiosk = this.isKiosk$.get() || undefined;
    const advanced = this.isAdvanced$.get() || undefined;

    const segments =
      media ? [group, page, media]
      : page ? [group, page]
      : group ? [group]
      : [];
    const path = `/${segments.join('/')}`;

    console.debug('go path', path);

    const url = createUrl(null, path, {
      kiosk,
      advanced,
      device,
    });

    this.log.d('go url', url);

    this.goUrl(url);
  }

  back() {
    this.log.d('back');
    glb.history?.back();
  }
}
