import { ReqOptions } from "fluxio";
import { ApiClient } from "./ApiClient";
import { Filter, ModelBase, ModelCreate, ModelUpdate } from "./models";

export class ApiRest<T extends ModelBase> {
    constructor(public client: ApiClient, public name: string) {}

    list(filter?: Filter<T>, fields?: (keyof T)[], limit?: number, offset?: number, options?: ReqOptions<T[]>): Promise<T[]> {
        return this.client.get<T[]>(`${this.name}`, { filter, fields, limit, offset }, options);
    }

    get(id: string, fields?: (keyof T)[], options?: ReqOptions<T>): Promise<T> {
        return this.client.get<T>(`${this.name}/${id}`, { fields }, options);
    }

    create(data: ModelCreate<T>, options?: ReqOptions<T>): Promise<T> {
        return this.client.post<T>(`${this.name}`, data, options);
    }

    update(id: string, changes: ModelUpdate<T>, options?: ReqOptions<T>): Promise<T> {
        return this.client.put<T>(`${this.name}/${id}`, changes, options);
    }

    remove(id: string, options?: ReqOptions<T>): Promise<T> {
        return this.client.delete<T>(`${this.name}/${id}`, options);
    }

    getFileUrl(id: string, filename: string) {
        return '';
    }
}