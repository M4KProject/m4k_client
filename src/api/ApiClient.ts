import { FIVE_MINUTES, flux, fluxStored, isString, logger, minifyUuid, req, ReqError, ReqMethod, ReqOptions, ReqParams, serverTime, syncServerTime, toDate, uuid } from "fluxio";

export interface M_Base {
    id: string;
    created: Date;
    updated: Date;
};

export type M_Create<T extends M_Base> = Omit<Omit<Omit<T, 'id'>, 'created'>, 'updated'>;
export type M_Update<T extends M_Base> = Partial<M_Create<T>>;

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

export interface M_Media extends M_Base, M_GroupId, M_UserId {
    data?: any;
    type: 'content'|'image'|'video';
    name: string;
    desc?: string;
    mime?: string;
    size?: number;
    width?: number;
    height?: number;
    seconds?: number;
    source?: string;
    parentId?: string;
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

    url$ = fluxStored<string>(this.key + '.url', '', isString);
    groupId$ = fluxStored<string>(this.key + '.groupId', '', isString);
    token$ = fluxStored<string>(this.key + '.token', '', isString);

    url: string = '';
    groupId: string = '';
    token: string = '';

    timeout = 10000;

    devices = new ApiRest<M_Device>(this, 'devices');
    groups = new ApiRest<M_Group>(this, 'groups');
    jobs = new ApiRest<M_Job>(this, 'jobs');
    medias = new ApiRest<M_Media>(this, 'medias');
    members = new ApiRest<M_Member>(this, 'members');
    users = new ApiRest<M_User>(this, 'users');
    
    constructor(public readonly key: string = 'pbClient') {
        this.url$.on((url) => {
            this.log.d('url', url);
            this.url = url;
        });
        this.groupId$.on((groupId) => {
            this.log.d('groupId', groupId);
            this.groupId = groupId;
        });
        this.token$.on((token) => {
            this.log.d('token', token);
            this.token = token;
        });

        this.getTime();
        // this.auth$.on((auth) => this.log.d('auth', auth));
    }

    setGroup(group: M_Group|string) {
        if (isString(group)) this.groupId$.set(group);
        else this.groupId$.set(group?.id||'');
    }

    reqOptions<T>(method: ReqMethod, url: string, options: ReqOptions<T> = {}): ReqOptions<T> {
        const groupId = minifyUuid(this.groupId);
        const token = minifyUuid(this.token);
        return {
            method,
            url,
            baseUrl: 'https://api.i.m4k.fr/',
            onError: error => {
                console.warn('api', method, url, options, error);
            },
            timeout: this.timeout,
            retry: 1,
            ...options,
            params: {
                group: groupId ? groupId : undefined,
                ...options.params,
            },
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

    put<T>(url: string, json?: any, options: ReqOptions<T> = {}) {
        return this.req('PUT', url, { ...options, json });
    }

    delete<T>(url: string, params?: ReqParams, options: ReqOptions<T> = {}) {
        return this.req('DELETE', url, { ...options, params });
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
        this.token$.set(login.token);
        return login;
    }

    me() {
        return this.get<M_User>('auth/me');
    }

    logout() {
        return this.post('auth/logout');
    }
}

export class ApiRest<T extends M_Base> {
    constructor(public api: ApiClient, public name: string) {}

    list(): Promise<T[]> {
        return this.api.get<T[]>(`${this.name}`);
    }

    get(id: string): Promise<T> {
        return this.api.get<T>(`${this.name}/${id}`);
    }

    create(data: M_Create<T>): Promise<T> {
        return this.api.post<T>(`${this.name}`, data);
    }

    update(id: string, changes: M_Update<T>): Promise<T> {
        return this.api.put<T>(`${this.name}/${id}`, changes);
    }

    remove(id: string): Promise<T> {
        return this.api.delete<T>(`${this.name}/${id}`);
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

    const user = await api.me();
    console.debug('user', user);

    const group = await api.groups.create({ key: uuid(), name: 'TEST', config: {} });
    console.debug('group', group);
    
    api.setGroup(group);

    const media = await api.medias.create({
        type: 'content',
        data: {},
        name: 'test'+uuid(),
        groupId: group.id,
        userId: user.id,
    });
    console.debug('media', media);

    const updatedMedia = await api.medias.update(media.id, {
        data: {
            deps: ['a', 'b']
        },
    });
    console.debug('updatedMedia', updatedMedia);

    const removedMedia = await api.medias.remove(media.id);
    console.debug('removedMedia', removedMedia);

    const logout = await api.logout();
    console.debug('logout', logout);
})();
