import { FIVE_MINUTES, flux, fluxStored, isString, logger, req, ReqError, ReqMethod, ReqOptions, ReqParams, serverTime, syncServerTime, toDate } from "fluxio";

export interface M_Base {
    id: string;
    created: Date;
    updated: Date;
};

export interface M_GroupId {
    groupId: string;
};

export interface M_UserId {
    userId: string;
};

export interface M_Key {
    key: string;
};

export interface M_User extends M_Base {
    name: string;
    password: string;
    email: string;
};

export interface M_Group extends M_Base, M_Key {
    name: string;
    config: unknown;
};

export interface M_Member extends M_Base, M_GroupId, M_UserId {
    desc: string;
    role: number;
};

export interface M_Media extends M_Base, M_GroupId, M_Key, M_UserId {
    data: unknown;
    generated: Date;
    type: string;
    title: string;
    desc: string;
    mime: string;
    size: number;
    width: number;
    height: number;
    seconds: number;
    source: string;
    variants: unknown;
    parentId: string;
    depIds: string[];
};

export interface M_Device extends M_Base, M_GroupId, M_Key, M_UserId {
    name: string;
    started: Date;
    online: Date;
    type: string;
    info: unknown;
    action: string;
    input: unknown;
    result: unknown;
    version: number;
    width: number;
    height: number;
    status: string;
    capture: string;
};

export interface M_Job extends M_Base, M_GroupId {
    name: string;
    action: string;
    input: unknown;
    result: unknown;
    status: string;
    progress: number;
    error: string;
    logs: string;
    files: unknown;
    mediaId: string;
};

export interface M_Lock extends M_Base, M_GroupId, M_Key {
};

export interface M_Log extends M_Base, M_GroupId, M_UserId {
    data: unknown;
    level: string;
    message: string;
    ip: string;
};

export interface ApiOptions<T extends M_Base> {
//   select?: PbKeys<T>[];
//   where?: PbWhere<T>;
//   orderBy?: (PbKeys<T> | `-${PbKeys<T>}`)[];
//   expand?: string;
//   page?: number;
//   perPage?: number;
//   skipTotal?: boolean;
//   data?: any;
    req?: ReqOptions<T>;

}

export class ApiClient {
    log = logger(this.key);
    url = fluxStored<string>(this.key + '.url', '', isString);
    groupId = fluxStored<string>(this.key + '.groupId', '', isString);
    token = fluxStored<string>(this.key + '.token', '', isString);
    error = flux<ReqError<any> | null>(null);
    timeout = 10000;
    
    // auth$ = fluxStored<PbAuth | undefined>(this.key + 'Auth$', undefined, isPbAuth);
    // url$ = fluxStored<string>(this.key + 'Url$', '', isString);
    // _realtime?: any;

    constructor(public readonly key: string = 'pbClient') {
        this.url.on((url) => this.log.d('url', url));
        this.groupId.on((groupId) => this.log.d('groupId', groupId));
        this.token.on((token) => this.log.d('token', token));
        this.error.on((error) => this.log.d('error', error));
        this.getTime();
        // this.auth$.on((auth) => this.log.d('auth', auth));
    }

    // getReqOptions<T extends M_Base>(
    //     method: ReqMethod,
    //     url: string,
    //     o: ApiOptions<T> = {}
    // ): ReqOptions {
    //     const result: ReqOptions = {
    //         baseUrl: this.url$.get(),
    //         method,
    //         url,
    //         onError: this.error$.setter(),
    //         timeout: this.timeoutMs,
    //         // form: o.data,
    //         ...o.req,
    //         // params: pbParams(o),
    //         headers: {
    //             ...this.getAuthHeaders(),
    //             ...o.req?.headers,
    //         },
    //     };
    //     // this.log.d('reqOptions', method, url, o, result);
    //     return result;
    // }


    // getApiUrl() {
    //     return this.url$.get();
    // }

    // setApiUrl(url: string) {
    //     this.log.d('setUrl', url);
    //     this.url$.set(url);
    //     this.initTime();
    // }

    // getUrl(path?: string, params?: Dictionary<string>) {
    //     const apiUrl = this.getApiUrl() || '/api/';
    //     let url = path ? pathJoin(apiUrl, path) : apiUrl;
    //     if (count(params) > 0) url = setUrlParams(url, params);
    //     // this.log.d('getUrl', apiUrl, path, params, url);
    //     return url;
    // }

    // setAuth(auth: PbAuth | undefined) {
    //     this.log.d('setAuth', auth);
    //     if (auth) {
    //         if (!isString(auth.token)) throw toError('no auth token');
    //         if (!isString(auth.id)) throw toError('no auth id');
    //     }
    //     this.auth$.set(auth);
    //     return auth;
    // }

    // getAuth() {
    //     return this.auth$.get();
    // }

    // getAuthId() {
    //     return this.getAuth()?.id;
    // }

    // getToken() {
    //     return this.getAuth()?.token || '';
    // }

    // getAuthHeaders() {
    //     const token = this.getToken();
    //     return {
    //         Authorization: `Bearer ${token}`,
    //         // 'X-Auth-Token': token,
    //     };
    // }


    // req<T extends PbModel>(method: ReqMethod, idOrUrl: string, o: PbOptions<T> = {}) {
    //     const reqOptions = this.getReqOptions(method, idOrUrl, o);
    //     return req(reqOptions).catch((error) => {
    //         this.log.w('req error', error);
    //         throw error;
    //     });
    // }

    // getDate() {
    //     return serverDate();
    // }

    // logout() {
    //     this.auth$.set(undefined);
    // }

    // authRefresh(o: PbOptions<any> = {}) {
    //     const auth = this.getAuth();
    //     this.log.i('refreshToken', auth, o);
    //     if (!auth) return;
    //     return this.req('POST', `collections/${auth.coll}/auth-refresh`, {
    //         ...o,
    //     })
    //         .then((result: any) => {
    //         this.log.d('authRefresh', result);
    //         const { token, record } = result || {};
    //         return this.setAuth({ ...record, coll: auth.coll, token });
    //         })
    //         .catch((error) => {
    //         this.log.e('authRefresh', error);
    //         if (error instanceof ReqError) {
    //             if (error.status === 401) {
    //             this.logout();
    //             throw toError(error.message);
    //             }
    //         }
    //         });
    // }

    reqOptions<T>(method: ReqMethod, url: string, options: ReqOptions<T> = {}): ReqOptions<T> {
        const token = this.token.get();
        return {
            method,
            url,
            baseUrl: 'http://127.0.0.1:4002',
            onError: this.error.setter(),
            timeout: this.timeout,
            ...options,
            headers: {
                Authorization: `Bearer ${token}`,
                'X-Auth-Token': token,
                ...options.headers,
            }
        }
    }

    req<T>(method: ReqMethod, url: string, options: ReqOptions<T> = {}) {
        return req(this.reqOptions(method, url, options));
    }

    get<T>(url: string, params?: ReqParams, options: ReqOptions<T> = {}) {
        return this.req('GET', url, { ...options, params });
    }

    post<T>(url: string, json?: any, options: ReqOptions<T> = {}) {
        return this.req('POST', url, { ...options, json });
    }

    getHealth() {
        return this.req('GET', '/health')
    }

    _isInitTime?: boolean;
    getTime() {
        if (!this._isInitTime) {
            this._isInitTime = true;
            this.log.d('initTime');
            syncServerTime(async () => {
                const result = await this.get<{ date: string }>('time');
                const time = toDate(result.date).getTime();
                this.log.d('serverTime', result, time);
                return time;
            }, FIVE_MINUTES);
        }
        return serverTime();
    }

    register(email: string, password: string) {
        return this.post('auth/register', { email, password });
    }

    async login(email: string, password: string) {
        const login = await this.post<{ token: string, expiresAt: string, expiresIn: number, user: M_User }>('auth/login', { email, password });
        this.token.set(login.token);
        return login;
    }

    me() {
        return this.get('auth/me');
    }

    logout() {
        return this.post('auth/logout');
    }
}

(async () => {
    const api = new ApiClient();
    console.debug('time', Date.now(), api.getTime());

    const email = `test${Date.now()}@gmail.com`;
    const password = 'azerty1234';

    const register = await api.register(email, password);
    console.debug('register', register);

    const login = await api.login(email, password);
    console.debug('login', login);

    const me = await api.me();
    console.debug('me', me);

    const logout = await api.logout();
    console.debug('logout', logout);
})();
