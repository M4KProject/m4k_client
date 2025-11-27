import { BData, NBData } from '@/components/box/bTypes';
import {
  _DeviceModel,
  _MediaModel,
  _GroupModel,
  _JobModel,
  _MemberModel,
  _UserModel,
  _LockModel,
  _SuperuserModel,
  _ApplicationModel,
} from './models.generated';

export * from './models.generated';

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

// export interface PlaylistContentModel extends ContentModel {
//   type: 'playlist';
//   data: {
//     items: PlaylistEntry[];
//   };
// }

export interface FileInfo {
  mime: string;
  type: MediaType;
  bytes: number;
  width?: number;
  height?: number;
  seconds?: number;
  nbFrames?: number;
  pagesCount?: number;
  page?: number;
}

export interface PdfData {
  pagesCount?: number;
  variants?: FileInfo[];
}

export interface VideoData {
  nbFrames?: number;
  variants?: FileInfo[];
}

export interface ImageData {
  variants?: FileInfo[];
}

export interface PlaylistData {
  items?: PlaylistEntry[];
}

export interface PageData {
  boxes?: NBData[];
}

export interface BaseMediaModel extends _MediaModel {
  // paths?: string[];
  // order?: string;
}

export interface FolderModel extends BaseMediaModel {
  type: 'folder';
  data?: undefined;
}

export interface VideoModel extends BaseMediaModel {
  type: 'video';
  data?: VideoData;
}

export interface ImageModel extends BaseMediaModel {
  type: 'image';
  data?: ImageData;
}

export interface PdfModel extends BaseMediaModel {
  type: 'pdf';
  data?: PdfData;
}

export interface PlaylistModel extends BaseMediaModel {
  type: 'playlist';
  data?: PlaylistData;
}

export interface PageModel extends BaseMediaModel {
  type: 'page';
  data?: PageData;
}

export interface MediaModel extends BaseMediaModel {
  data?: VideoData & ImageData & PdfData & PlaylistData & PageData;
}

export type MediaType = MediaModel['type'] & string;

export interface GroupModel extends _GroupModel {
  data?: {
    isDark?: boolean;
    primary?: string;
    secondary?: string;
  };
}

export interface JobModel extends Omit<_JobModel, 'action'> {
  action?: _JobModel['action'] | 'upload';
}

export interface ConvertJobModel extends JobModel {
  action: 'convert';
  input: {};
}

export enum Role {
  viewer = 10,
  editor = 20,
  admin = 30,
}

export interface MemberModel extends _MemberModel {
  role?: Role; // admin > editor > viewer
}

export interface UserModel extends Omit<_UserModel, 'tokenKey'> {}

export interface ApplicationModel extends _ApplicationModel {}

export interface DeviceModel extends _DeviceModel {
  // config?: {
  //     kiosk?: boolean;
  //     startUrl?: string;
  //     url?: string;
  //     zipPath?: string;
  //     installDir?: string;
  //     logs?: boolean;
  //     logsRemote?: ''|'debug'|'info'|'warn'|'error';
  //     screenBrightness?: number;
  //     script?: string|string[];
  //     rotate?: number;
  //     webviewRotate?: number;
  //     settings?: TMap<any>;
  //     default?: number;
  //     reloadIntervalMs?: number;
  //     updateIntervalMs?: number;
  //     usbUpdateIntervalMs?: number;
  //     captureIntervalMs?: number;
  //     captureType?: 'device'|'preview';
  //     playlist?: {
  //         timer?: number;
  //         items?: {
  //             timer?: number;
  //             fileUrl?: string;
  //         }[],
  //     };
  // };
  // info?: {
  //     webview?: string;
  //     soft?: string;
  //     os?: string;
  //     ip?: string;
  //     width?: number;
  //     height?: number;
  //     internalStorage?: string;
  //     externalStorage?: string;
  //     softId?: string;
  //     softName?: string;
  //     model?: string;
  // };
  // result?: {
  //     action?: _DeviceModel['action'];
  //     input?: _DeviceModel['input'];
  //     success?: boolean;
  //     error?: { name?: string; message: string };
  //     value?: any;
  // };
}

export interface LockModel extends _LockModel {}

export interface SuperUserModel extends _SuperuserModel {}

export type ItemId = string | { id: string };