import { ContentModel } from "@common/api";

export interface ContentProps<T extends ContentModel = any> {
    content: T;
    data: T['data'];
    updateContent: (changes: Partial<T>) => Promise<void>;
    updateData: (changes: Partial<T['data']>) => Promise<void>;
}