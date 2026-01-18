import { ModelBase } from "@/api/models.base";
import type { NBData } from "@/components/box/bTypes";
import type { ReqOptions } from "fluxio";

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

export interface MBase {
    id: string;
    created: Date;
    updated: Date;
    removed?: Date;
};

export type MCreate<T extends MBase> = Omit<T, 'id'|'created'|'updated'|'userId'|'groupId'> & Partial<T>;
export type MUpdate<T extends MBase> = Partial<T>;

export interface MUser extends MBase {
    name: string;
    password: string;
    email: string;
};

export interface MGroup extends MBase {
    name: string;
    key: string;
    config?: {
      isDark?: boolean;
      primary?: string;
      secondary?: string;
    };
};

export interface MMember extends MBase {
    desc: string;
    role: Role;
    groupId: string;
    userId: string;
};

export interface MMedia extends MBase {
    type: MMediaType;
    name: string;
    data?: any;
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

export interface MDevice extends MBase {
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

export interface MJob extends MBase {
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

export interface MLock extends MBase {
    groupId: string;
    key: string;
};

export interface MLog extends MBase {
    data: unknown;
    level: string;
    message: string;
    ip: string;
    groupId: string;
    userId: string;
};

export interface MApplication extends MBase {};

export interface MAuth {
  token: string;
  expiresAt: string,
  userId: string;
  email: string;
}

///// MEDIAS /////

export interface MFile {
  path: string;
  type: 'image'|'video';
  bytes?: number;
  mime?: string;
  width?: number;
  height?: number;
  seconds?: number;
  nbFrames?: number;
  pagesCount?: number;
  page?: number;
}

export interface MFolder extends MMedia {
  type: 'folder';
  data?: undefined;
}

export interface MVideoData {
  nbFrames?: number;
  files?: MFile[];
}
export interface MVideo extends MMedia {
  type: 'video';
  data?: MVideoData;
}

export interface MImageData {
  files?: MFile[];
}
export interface MImage extends MMedia {
  type: 'image';
  data?: MImageData;
}

export interface MPdfData {
  pagesCount?: number;
  files?: MFile[];
}
export interface MPdf extends MMedia {
  type: 'pdf';
  data?: MPdfData;
}

export interface MPlaylistData {
  items?: PlaylistEntry[];
}
export interface MPlaylist extends MMedia {
  type: 'playlist';
  data?: MPlaylist;
}

export interface MPageData {
  boxes?: NBData[];
}
export interface MPage extends MMedia {
  type: 'page';
  data?: MPageData;
}

// export type FilterOp0 = 'null'|'!null'|'exists'|'!exists';
// export type FilterOp1 = '='|'>'|'<'|'>='|'<='|'!='|'like'|'!like'|'ilike'|'!ilike'|'in'|'!in';
// export type FilterOp2 = 'between'|'!between';
// export type FilterOp = FilterOp0|FilterOp1|FilterOp2;
// export type FilterVal = string|number|(string|number)[];
// export type FilterItem<T = any> = T | [FilterOp0] | [FilterOp1, FilterVal] | [FilterOp2, FilterVal, FilterVal];
// export type Filter<T extends ModelBase> = string|{ [P in keyof T]?: FilterItem<T[P]> };

export type MFilterOp0 = 'null' | '!null' | 'exists' | '!exists';
export type MFilterOp1 =
  | '='
  | '>'
  | '<'
  | '>='
  | '<='
  | '!='
  | 'like'
  | '!like'
  | 'ilike'
  | '!ilike'
  | 'in'
  | '!in';
export type MFilterOp2 = 'between' | '!between';
export type MFilterOp = MFilterOp0 | MFilterOp1 | MFilterOp2;
export type MFilterVal = string | number | (string | number)[];
export type MFilterProp<T = unknown> =
  | T
  | [MFilterOp0]
  | [MFilterOp1, MFilterVal]
  | [MFilterOp2, MFilterVal, MFilterVal];
export type MFilter<T> = { [P in keyof T]?: MFilterProp<T[P]> };

export type MMediaType =  'content' | 'folder' | 'image' | 'pdf' | 'video' | 'unknown' | 'playlist' | 'page' | '';

export type MFormat = '' | 'thumb' | 'hd';

export type MId<T extends { id: string } = { id: string }> = string | T;

export interface MOptions<T=any, U=T> extends ReqOptions<T> {
  filter?: MFilter<U>,
  fields?: (keyof U)[],
  limit?: number,
  offset?: number,
}