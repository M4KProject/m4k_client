import { flux, fluxStored, isItem, isString, logger, minifyUuid, req, ReqError, ReqMethod, ReqOptions, ReqParams, SECOND } from "fluxio";
import { ApiAuth, Group, MediaFormat } from "./models";

export class ApiClient {
    log = logger(this.key);

    url$ = fluxStored<string>(this.key + '.url', '', isString);
    groupId$ = fluxStored<string>(this.key + '.groupId', '', isString);
    auth$ = fluxStored<ApiAuth|null>(this.key + '.auth', null, isItem);
    error$ = flux<ReqError|null>(null);

    url: string = '';
    groupId: string = '';
    auth: ApiAuth|null = null;
    baseUrl = 'https://api.i.m4k.fr/';

    timeout = 10 * SECOND;

    constructor(public readonly key: string = 'pbClient') {
        this.url$.on((url) => {
            this.log.d('url', url);
            this.url = url;
        });
        this.groupId$.on((groupId) => {
            this.log.d('groupId', groupId);
            this.groupId = groupId;
        });
        this.auth$.on((auth) => {
            this.log.d('auth', auth);
            this.auth = auth;
        });
    }

    setGroup(group: Group|string) {
        if (isString(group)) this.groupId$.set(group);
        else this.groupId$.set(group?.id||'');
    }

    reqOptions<T>(method: ReqMethod, url: string, options: ReqOptions<T> = {}): ReqOptions<T> {
        const groupId = minifyUuid(this.groupId);
        const token = this.auth?.token;
        const params = options.params;
        const headers = options.headers;
        return {
            method,
            url,
            baseUrl: this.baseUrl,
            onError: error => {
                console.warn('api', method, url, options, error);
                this.error$.set(error);
            },
            timeout: this.timeout,
            retry: 1,
            ...options,
            params: groupId ? {
                group: groupId,
                ...params,
            } : params,
            headers: token ? {
                Authorization: `Bearer ${token}`,
                'X-Auth-Token': token,
                ...headers,
            } : headers
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

    getFileUrl(path: string, format: MediaFormat = '', download: boolean = false) {
        return `${this.baseUrl}/files/${path}?format=${format}${download?'&download=1':''}`;
    }

    needUserId(): string {
        const userId = this.auth$.get()?.userId;
        if (userId) return userId;
        throw new Error('No auth');
    }

    needGroupId(): string {
        const groupId = this.groupId$.get();
        if (groupId) return groupId;
        throw new Error('No group');
    }
}
