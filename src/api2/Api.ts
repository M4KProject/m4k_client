import { FIVE_MINUTES, fluxCombine, logger, syncServerTime, toDate } from "fluxio";
import { MAuth, MApplication, MDevice, MGroup, MJob, MMember, MUser, MId, MOptions } from "./models";
import { ApiClient } from "./ApiClient";
import { ApiMedias } from "./ApiMedias";
import { ApiRest } from "./ApiRest";
import { toId } from "./ApiHelpers";

export class Api {
  log = logger('api2');

  client = new ApiClient();

  devices = new ApiRest<MDevice>(this.client, 'devices');
  groups = new ApiRest<MGroup>(this.client, 'groups');
  jobs = new ApiRest<MJob>(this.client, 'jobs');
  medias = new ApiMedias(this.client, 'medias');
  members = new ApiRest<MMember>(this.client, 'members');
  users = new ApiRest<MUser>(this.client, 'users');
  applications = new ApiRest<MApplication>(this.client, 'applications');

  constructor() {
    this.log.d('initTime');

    this.groups.id$.on(id => {
      this.client.groupId = id;
      this.refresh();
    });
    this.client.auth$.map(a => a?.userId).on(() => this.refresh());

    this.client.groupId = this.groups.id$.get();
    this.refresh();

    syncServerTime(async () => {
      const result = await this.client.get<{ date: string }>('time');
      const time = toDate(result.date).getTime();
      this.log.d('serverTime', result, time);
      return time;
    }, FIVE_MINUTES);
  }

  refresh() {
    if (!this.client.auth$.get()) return;

    this.devices.load();
    this.groups.load();
    this.jobs.load();
    this.medias.load();
    this.members.load();
    this.users.load();
    this.applications.load();
  }
  
  getHealth(options?: MOptions) {
    return this.client.req('GET', '/health', options)
  }
  
  async authRegister(email: string, password: string, login: boolean = true) {
    await this.client.post<MAuth>('auth/register', { email, password });
    if (!login) return;
    return await this.authLogin(email, password);
  }

  async authLogin(email: string, password: string) {
    const auth = await this.client.post<MAuth>('auth/login', { email, password });
    return this.setAuth(auth);
  }

  async authDevice(email: string, password: string) {
    const auth = await this.client.post<MAuth>('auth/device', { email, password });
    return this.setAuth(auth);
  }

  async passwordReset(email: string) {
    throw new Error('Method not implemented.');
  }

  me(options?: MOptions<MUser>) {
    return this.client.get<MUser>('auth/me', options);
  }

  logout(options?: MOptions) {
    const promise = this.client.post('auth/logout', options);
    this.client.auth$.set(null);
    return promise;
  }

  getAuth() {
    return this.client.auth$.get();
  }

  setAuth(auth: MAuth) {
    this.client.auth$.set(auth);
    return auth;
  }

  setGroupId(mId: MId<MGroup>) {
    this.groups.id$.set(toId(mId));
  }

  needUserId(): string {
    const userId = this.client.auth$.get()?.userId;
    if (userId) return userId;
    throw new Error('No auth');
  }

  needGroupId(): string {
    const groupId = this.groups.id$.get();
    if (groupId) return groupId;
    throw new Error('No group');
  }
}


// import { getPbClient, PbAuthColl, PbColl } from 'pblite';
// import { Sync } from './sync';
// import {
//   ApplicationModel,
//   DeviceModel,
//   FileInfo,
//   GroupModel,
//   JobModel,
//   MediaModel,
//   MemberModel,
//   UserModel,
// } from './models';
// import {
//   byId,
//   Dictionary,
//   getExt,
//   groupBy,
//   isString,
//   logger,
//   removeAccents,
//   toError,
// } from 'fluxio';
// import { setUrlParams } from 'fluxio';
// import { isStringValid } from 'fluxio';
// import { app } from '@/app';
// import { startDownload } from '@/utils/startDownload';

// const log = logger('Api');

// export interface Variant extends FileInfo {
//   media: MediaModel;
//   file: string;
// }

// export class Api {
//   pb = getPbClient();

//   device = new Sync<DeviceModel>('devices');
//   group = new Sync<GroupModel>('groups');
//   job = new Sync<JobModel>('jobs');
//   media = new Sync<MediaModel>('medias');
//   member = new Sync<MemberModel>('members');

//   applicationColl = new PbColl<ApplicationModel>('applications');
//   userColl = new PbAuthColl<UserModel>('users');

//   constructor() {
//     app.api = this;
//     this.initPbUrl();
//     this.pb.authRefresh();
//   }

//   initPbUrl() {
//     const host = location.host;
//     const pbClient = getPbClient();
//     log.d('host', host);
//     if (host.includes(':')) {
//       const prevApiUrl = pbClient.getApiUrl();
//       log.d('prevApiUrl', prevApiUrl);
//       if (!prevApiUrl) {
//         const nextApiUrl = 'https://i.m4k.fr/api/';
//         log.d('set url', prevApiUrl, nextApiUrl);
//         pbClient.setApiUrl(nextApiUrl);
//       }
//     }
//   }

//   needAuthId() {
//     const id = this.pb.getAuthId();
//     if (!isStringValid(id)) throw toError('no group id');
//     return id;
//   }

//   getMediaDownloadUrl(mediaOrId?: string | MediaModel) {
//     let url = '';
//     const media = isString(mediaOrId) ? this.media.get(mediaOrId) : mediaOrId;
//     if (media) {
//       const variants = this.getVariants(media);
//       const videos = variants.filter((v) => v.type === 'video');
//       if (videos.length) url = this.getMediaUrl(videos[0]);
//       else {
//         const images = variants.filter((v) => v.type === 'image');
//         if (images.length) url = this.getMediaUrl(images[0]);
//       }
//       if (url) url = setUrlParams(url, { download: '1' });
//     }
//     return url;
//   }

//   getVariants(media?: MediaModel): Variant[] {
//     if (!media || !media.data) return [];
//     const results: Variant[] = [];
//     media.data?.variants?.forEach((info, i) => {
//       if (!media.variants) return;
//       const file = media.variants[i];
//       if (isStringValid(file) && info.mime) {
//         results.push({ ...info, file, media, mime: info.mime });
//       }
//     });
//     if (isStringValid(media.source) && media.mime && media.type && media.bytes !== undefined) {
//       const file = media.source;
//       results.push({
//         ...media,
//         file,
//         media,
//         mime: media.mime,
//         type: media.type,
//         bytes: media.bytes,
//       });
//     }
//     return results;
//   }

//   getMediaUrl(
//     v?: Variant,
//     thumb?: string | number,
//     download?: boolean,
//     params?: Dictionary<string>
//   ) {
//     return (v && this.media.coll.getFileUrl(v.media.id, v.file, thumb, download, params)) || '';
//   }

//   startMediaDownload(mediaOrId?: string | MediaModel) {
//     const media = isString(mediaOrId) ? this.media.get(mediaOrId) : mediaOrId;
//     if (!media) return;
//     const url = this.getMediaDownloadUrl(media);
//     const ext = getExt(url);
//     const filename =
//       removeAccents(media.title || String(media.source) || media.id).trim() + '.' + ext;
//     startDownload(url, filename);
//   }

//   getMediasByParent(medias: MediaModel[]) {
//     const mediaById = byId(medias);
//     const mediasByParent = groupBy(medias, (m) => m.parent || '');
//     const rootMedias = mediasByParent[''] || (mediasByParent[''] = []);
//     for (const parentId in mediasByParent) {
//       if (parentId) {
//         const parent = mediaById[parentId];
//         if (!parent && mediasByParent[parentId]) {
//           rootMedias.push(...mediasByParent[parentId]!);
//         }
//       }
//     }
//     return mediasByParent;
//   }
// }
