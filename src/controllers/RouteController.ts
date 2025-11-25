import {
  createUrl,
  flux,
  fluxStored,
  glb,
  isBoolean,
  isDeepEqual,
  isDefined,
  isEmpty,
  isString,
  logger,
  onEvent,
  toBoolean,
} from 'fluxio';
import { getUrlParams } from 'fluxio';

export type Page = '' | 'dashboard' | 'members' | 'devices' | 'medias' | 'edit' | 'view';

export interface Route {
  group?: string;
  page?: Page;
  media?: string;
  device?: string;
}

export class RouteController {
  log = logger('Route');

  url$ = flux('');
  route$ = flux<Route>({});

  group$ = fluxStored<string>('groupKey', 'demo', isString);
  page$ = this.route$.map(r => r.page);
  media$ = this.route$.map(r => r.media);
  device$ = flux<string>('');

  isKiosk$ = fluxStored<boolean>('isKiosk', false, isBoolean);
  isAdvanced$ = fluxStored<boolean>('isAdvanced', false, isBoolean);

  constructor() {
    this.route$.isEqual = isDeepEqual;

    this.url$.on(url => {
      const p = getUrlParams(url);
      const s = (p.path || '').split('/').filter((s) => s);

      const group = p.group || s[0] || this.group$.get();
      const page = p.page as Page || s[1] as Page || this.page$.get();
      const media = p.media || s[2] || this.media$.get();

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
