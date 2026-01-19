import { Dictionary, flux, fluxStored, isItem, logger, MINUTE, req, ReqError, ReqMethod, ReqOptions, SECOND, serverDate } from "fluxio";
import { MAuth, MFormat, MOptions } from "./models";

export class ApiClient {
    log = logger(this.key);

    groupId: string = '';
    auth$ = fluxStored<MAuth|null>(this.key + '.auth', null, isItem);
    isAuth$ = this.auth$.map(auth => !!auth);
    error$ = flux<ReqError|null>(null);

    baseUrl = 'https://api.i.m4k.fr/';

    timeout = 10 * SECOND;

    constructor(public readonly key: string = 'pbClient') {
        this.auth$.on((auth) => {
            this.log.d('auth', auth);
            this.checkExpiresAt();
        });
        this.checkExpiresAt();
        setInterval(() => this.checkExpiresAt(), MINUTE);
    }

    checkExpiresAt() {
        const auth = this.auth$.get();
        const expiresAt = new Date(auth?.expiresAt||0);
        const isAuth = expiresAt > serverDate();
        if (!isAuth) this.auth$.set(null);
    }

    reqOptions<T=any, U=T>(method: ReqMethod, url: string, options?: MOptions<T, U>, json?: any): ReqOptions<T> {
        const { fields, limit, offset, params, headers, ...reqOptions } = options || {};
        const h: Dictionary<string> = {};
        const p: Dictionary<any> = {};

        const token = this.auth$.get()?.token;
        if (token) {
            h.Authorization = `Bearer ${token}`;
            h['X-Auth-Token'] = token;
        }

        const groupId = this.groupId;
        if (groupId) p.group = groupId;
        if (fields) p.fields = fields;
        if (limit) p.limit = limit;
        if (offset) p.offset = offset;

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
            json,
            ...reqOptions,
            params: { ...p, ...params },
            headers: { ...h, ...headers },
        }
    }

    req<T=any, U=T>(method: ReqMethod, url: string, options?: MOptions<T, U>, json?: any) {
        return req(this.reqOptions(method, url, options, json));
    }

    get<T=any, U=T>(url: string, options?: MOptions<T, U>) {
        return this.req('GET', url, options);
    }

    post<T=any, U=T>(url: string, json?: any, options?: MOptions<T, U>) {
        return this.req('POST', url, options, json);
    }

    put<T=any, U=T>(url: string, json?: any, options?: MOptions<T, U>) {
        return this.req('PUT', url, options, json);
    }

    delete<T=any, U=T>(url: string, options?: MOptions<T, U>) {
        return this.req('DELETE', url, options);
    }

    getFileUrl(path: string, format: MFormat = '', download: boolean = false) {
        return `${this.baseUrl}/files/${path}?format=${format}${download?'&download=1':''}`;
    }
}
