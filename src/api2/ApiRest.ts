import { deepClone, flux, fluxStored, getChanges, isEmpty, isItems, logger, Logger, ReqOptions } from "fluxio";
import { ApiClient } from "./ApiClient";
import { MFilter, MId, MBase, MCreate, MUpdate, MOptions } from "./models";
import { toId } from "./ApiHelpers";

export class ApiRest<T extends MBase> {
    readonly log: Logger;
    readonly items$ = fluxStored<T[]>(this.name+'$', [], isItems);

    constructor(public client: ApiClient, public name: string) {
        this.log = logger(name);
    }

    async load() {
        const items = await this.list();
        this.items$.set(items);
        return items;
    }

    refresh() {
        this.load();
    }

    async list(filter?: MFilter<T>, options?: MOptions<T[], T>): Promise<T[]> {
        try {
            const items = await this.client.get<T[], T>(`${this.name}`, options);
            this.log.d('list', filter, options, items);
            return items;
        }
        catch(error) {
            this.log.w('list', filter, options, error);
            throw error;
        }
    }

    async get(mId: MId<T>, options?: MOptions<T>): Promise<T|undefined> {
        const id = toId(mId);
        if (!id) return undefined;
        try {
            const item = await this.client.get<T>(`${this.name}/${id}`, options);
            this.log.d('get', id, options, item);
            return item || undefined;
        }
        catch(error) {
            this.log.w('get', id, options, error);
            throw error;
        }
    }

    async create(data: MCreate<T>, options?: MOptions<T>): Promise<T> {
        try {
            const item = await this.client.post<T>(`${this.name}`, data, options);
            this.log.d('create', data, options, item);
            return item;
        }
        catch(error) {
            this.log.w('create', data, options, error);
            throw error;
        }
    }

    async update(mId: MId<T>, changes: MUpdate<T>, options?: MOptions<T>): Promise<T|undefined> {
        const id = toId(mId);
        if (!id) return undefined;
        try {
            const item = await this.client.put<T>(`${this.name}/${id}`, changes, options);
            this.log.d('update', id, changes, options, item);
            return item || undefined;
        }
        catch(error) {
            this.log.w('update', id, changes, options, error);
            throw error;
        }
    }

    async remove(mId: MId<T>, options?: MOptions<T>): Promise<T|undefined> {
        const id = toId(mId);
        if (!id) return undefined;
        try {
            const item = await this.client.delete<T>(`${this.name}/${id}`, options);
            this.log.d('remove', id, options, item);
            return item;
        }
        catch(error) {
            this.log.w('remove', id, options, error);
            throw error;
        }
    }

    async apply(mId: MId<T>, cb: (prev: T) => void, options?: MOptions<T>): Promise<T|undefined> {
        const id = toId(mId);
        this.log.d('apply', id, options);
        if (!id) return undefined;
        const prev = await this.get(mId, options);
        if(!prev) return undefined;
        const next = deepClone(prev);
        cb(next);
        const changes = getChanges(prev, next);
        if (isEmpty(changes)) return prev;
        try {
            const result = await this.update(id, changes, options);
            this.log.d('apply', id, options, result);
            return result;
        } catch (error) {
            this.log.w('apply', id, options, error);
            throw error;
        }
    }

    getFileUrl(mId: MId<T>, filename: string) {
        const id = toId(mId);
        return '';
    }
}