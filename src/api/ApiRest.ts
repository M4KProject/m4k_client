import { ApiClient } from "./ApiClient";
import { Filter, ModelBase, ModelCreate, ModelUpdate } from "./models";

export class ApiRest<T extends ModelBase> {
    constructor(public client: ApiClient, public name: string) {}

    list(filter?: Filter<T>, fields?: (keyof T)[], limit?: number, offset?: number): Promise<T[]> {
        return this.client.get<T[]>(`${this.name}`, { filter, fields, limit, offset });
    }

    get(id: string, fields?: (keyof T)[]): Promise<T> {
        return this.client.get<T>(`${this.name}/${id}`, { fields });
    }

    create(data: ModelCreate<T>): Promise<T> {
        return this.client.post<T>(`${this.name}`, data);
    }

    update(id: string, changes: ModelUpdate<T>): Promise<T> {
        return this.client.put<T>(`${this.name}/${id}`, changes);
    }

    remove(id: string): Promise<T> {
        return this.client.delete<T>(`${this.name}/${id}`);
    }

    getFileUrl(id: string, filename: string) {
        return '';
    }
}