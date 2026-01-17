import { NBData } from "@/components/box/bTypes";

export enum Role {
  viewer = 10,
  editor = 20,
  admin = 30,
}

export type FieldType =
  | 'email'
  | 'password'
  | 'text'
  | 'multiline'
  | 'html'
  | 'color'
  | 'number'
  | 'select'
  | 'picker'
  | 'switch'
  | 'check'
  | 'image'
  | 'doc'
  | 'date'
  | 'datetime'
  | 'time';

export interface FieldInfo<T = any> {
  row?: boolean;
  type?: FieldType;
  name?: string;
  label?: string;
  helper?: string;
  error?: string;
  items?: ([T, string] | false | null | undefined)[];
  required?: boolean;
  readonly?: boolean;
  castType?: string;
  props?: any;
}

// export interface EmptyContentModel extends ContentModel {
//   type: 'empty';
// }

// export interface FormContentModel extends ContentModel {
//   type: 'form';
//   data: {
//     fields: FieldInfo[];
//     values: { [prop: string]: any };
//   };
// }

// export interface TableContentModel extends ContentModel {
//   type: 'table';
//   data: {
//     fields: FieldInfo[];
//     items: { [prop: string]: any }[];
//   };
// }

// export interface HtmlContentModel extends ContentModel {
//   type: 'html';
//   data: {
//     html: string;
//   };
// }

export type MediaFit = 'contain' | 'cover' | 'fill';
export type MediaAnim = 'toLeft' | 'toBottom' | 'fade' | 'zoom';

export interface PlaylistEntry {
  title?: string;
  seconds?: number;
  duration?: number;
  startHours?: number;
  endHours?: number;
  language?: string;
  media?: string;
  fit?: MediaFit;
  anim?: MediaAnim;
}


export interface ModelBase {
    id: string;
    created: Date;
    updated: Date;
};

export type ModelCreate<T extends ModelBase> = Omit<Omit<Omit<Omit<Omit<T, 'id'>, 'created'>, 'updated'>, 'userId'>, 'groupId'> & Partial<T>;
export type ModelUpdate<T extends ModelBase> = Partial<ModelCreate<T>>;

export interface ModelGroupId {
  groupId: string;
};

export interface User extends ModelBase {
    name: string;
    password: string;
    email: string;
};

export interface Group extends ModelBase {
    name: string;
    key: string;
    config?: {
      isDark?: boolean;
      primary?: string;
      secondary?: string;
    };
};

export interface Member extends ModelBase {
    desc: string;
    role: Role;
    groupId: string;
    userId: string;
};

export interface Media extends ModelBase {
    data?: any;
    type: MediaType;
    name: string;
    desc?: string;
    mime?: string;
    size?: number;
    width?: number;
    height?: number;
    seconds?: number;
    source?: string;
    parentId?: string;
    groupId: string;
    userId: string;
};

export interface Device extends ModelBase {
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
    groupId: string;
    userId: string;
    key: string;
};

export interface Job extends ModelBase {
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
    groupId: string;
};

export interface Lock extends ModelBase {
    groupId: string;
    key: string;
};

export interface Log extends ModelBase {
    data: unknown;
    level: string;
    message: string;
    ip: string;
    groupId: string;
    userId: string;
};

export interface Application extends ModelBase {};

export interface ApiAuth {
  token: string;
  expiresAt: string,
  userId: string;
  email: string;
}

///// MEDIAS /////

export interface FileInfo {
  path: string;
  mime: string;
  type: 'image'|'video';
  bytes: number;
  width?: number;
  height?: number;
  seconds?: number;
  nbFrames?: number;
  pagesCount?: number;
  page?: number;
}







export interface FolderMedia extends Media {
  type: 'folder';
  data?: undefined;
}

export interface VideoData {
  nbFrames?: number;
  files?: FileInfo[];
}
export interface VideoMedia extends Media {
  type: 'video';
  data?: VideoData;
}

export interface ImageData {
  files?: FileInfo[];
}
export interface ImageMedia extends Media {
  type: 'image';
  data?: ImageData;
}

export interface PdfData {
  pagesCount?: number;
  files?: FileInfo[];
}
export interface PdfMedia extends Media {
  type: 'pdf';
  data?: PdfData;
}

export interface PlaylistData {
  items?: PlaylistEntry[];
}
export interface PlaylistMedia extends Media {
  type: 'playlist';
  data?: PlaylistData;
}

export interface PageData {
  boxes?: NBData[];
}

export type FilterOp0 = 'null'|'!null'|'exists'|'!exists';
export type FilterOp1 = '='|'>'|'<'|'>='|'<='|'!='|'like'|'!like'|'ilike'|'!ilike'|'in'|'!in';
export type FilterOp2 = 'between'|'!between';
export type FilterOp = FilterOp0|FilterOp1|FilterOp2;
export type FilterVal = string|number|(string|number)[];
export type FilterItem<T = any> = T | [FilterOp0] | [FilterOp1, FilterVal] | [FilterOp2, FilterVal, FilterVal];
export type Filter<T extends ModelBase> = string|{ [P in keyof T]?: FilterItem<T[P]> };

export type MediaType =  'content' | 'folder' | 'image' | 'pdf' | 'video' | 'unknown' | 'playlist' | '';

export type MediaFormat = '' | 'thumb' | 'hd';
