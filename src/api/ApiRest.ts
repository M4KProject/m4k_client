import { logger, Logger, ReqOptions } from "fluxio";
import { ApiClient } from "./ApiClient";
import { Filter, ItemOrId, ModelBase, ModelCreate, ModelUpdate } from "./models";
import { toId } from "./ApiHelpers";

export class ApiRest<T extends ModelBase> {
    readonly log: Logger;

    constructor(public client: ApiClient, public name: string) {
        this.log = logger(name);
    }

    async list(filter?: Filter<T>, fields?: (keyof T)[], limit?: number, offset?: number, options?: ReqOptions<T[]>): Promise<T[]> {
        try {
            const items = await this.client.get<T[]>(`${this.name}`, { filter, fields, limit, offset }, options);
            this.log.d('list', filter, fields, limit, offset, options, items);
            return items;
        }
        catch(error) {
            this.log.w('list', filter, fields, limit, offset, options, error);
            throw error;
        }
    }

    async get(itemOrId: ItemOrId<T>, fields?: (keyof T)[], options?: ReqOptions<T>): Promise<T|undefined> {
        const id = toId(itemOrId);
        if (!id) return undefined;
        try {
            const item = await this.client.get<T>(`${this.name}/${id}`, { fields }, options);
            this.log.d('get', id, fields, options, item);
            return item || undefined;
        }
        catch(error) {
            this.log.w('get', id, fields, options, error);
            throw error;
        }
    }

    async create(data: ModelCreate<T>, options?: ReqOptions<T>): Promise<T> {
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

    async update(itemOrId: ItemOrId<T>, changes: ModelUpdate<T>, options?: ReqOptions<T>): Promise<T|undefined> {
        const id = toId(itemOrId);
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

    async remove(itemOrId: ItemOrId<T>, options?: ReqOptions<T>): Promise<T|undefined> {
        const id = toId(itemOrId);
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

    getFileUrl(itemOrId: ItemOrId<T>, filename: string) {
        const id = toId(itemOrId);
        return '';
    }
}