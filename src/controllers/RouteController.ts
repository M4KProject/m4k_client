import { createUrl, flux, fluxStored, glb, isBoolean, isString, isStringValid, logger, onEvent } from 'fluxio';
import { getUrlParams } from 'fluxio';

export type Page = 'dashboard' | 'account' | 'groups' | 'members' | 'devices' | 'medias' | 'jobs' | 'edit';

export interface Route {
  groupKey?: string;
  page?: Page;
  id?: string;
  isDevice?: boolean;
}

export class RouteController {
  log = logger('Route');
  url$ = flux('');
  route$ = this.url$.map(url => this.parse(url));
  groupKey$ = fluxStored<string>('groupKey', 'demo', isString);
  isDevice$ = fluxStored<boolean>('isDevice', false, isBoolean);

  constructor() {
    if (glb.window) {
      onEvent(glb.window, 'hashchange', this.sync);
      onEvent(glb.window, 'popstate', this.sync);
      this.sync();
    }
  }

  private parse = (url: string): Route => {
    const params = getUrlParams(url);
    const path = params.path;
    const segments = (path||'').split('/').filter(s => s);
    const [groupKey, page, id] = segments;
    const isDevice = !!(params.d || params.device);

    if (isStringValid(groupKey)) this.groupKey$.set(groupKey);
    if (isBoolean(isDevice)) this.isDevice$.set(isDevice);

    const route = {
      groupKey: groupKey || this.groupKey$.get(),
      page: (page as Page) || 'dashboard',
      id,
      isDevice: isDevice || this.isDevice$.get(),
    };

    this.log.d('parse', route);

    return route;
  };

  private sync = () => {
    this.url$.set(glb.location?.href);
  };

  goUrl(url: string) {
    this.log.i('goUrl', url);

    glb.history?.pushState(null, '', url);
    this.url$.set(url);
  }

  go(changes: Partial<Route>) {
    this.log.d('go', changes);

    const current = this.route$.get();
    const route = { ...current, ...changes };

    // Reset id if page changes
    if (changes.page && changes.page !== current.page) {
      route.id = undefined;
    }

    const { groupKey, page, id, isDevice } = route;
    const segments =
      id ? [groupKey, page, id] :
      page ? [groupKey, page] :
      groupKey ? [groupKey] :
      [];
    const path = `/${segments.join('/')}`;

    console.debug('go path', path);

    const url = createUrl(null, path, {
      device: isDevice || undefined,
    });

    this.log.d('go url', url);

    this.goUrl(url);
  };

  back() {
    this.log.d('back');
    glb.history?.back();
  };
}
