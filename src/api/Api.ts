import { getPbClient, PbAuthColl, PbColl } from "pblite";
import { Sync } from "./sync";
import {
  ApplicationModel,
  DeviceModel,
  FileInfo,
  GroupModel,
  JobModel,
  MediaModel,
  MemberModel,
  UserModel,
} from './models';
import { Dictionary, fluxStored, getExt, isString, logger, removeAccents, toError } from 'fluxio';
import { setUrlParams } from 'fluxio';
import { isStringValid } from 'fluxio';
import { app } from "@/app";
import { startDownload } from "@/utils/startDownload";

const log = logger('Api');

export interface Variant extends FileInfo {
  media: MediaModel;
  file: string;
}

export class Api {
  pb = getPbClient();
  groupId$ = fluxStored<string>('groupId$', '', isString);

  device = new Sync<DeviceModel>('devices');
  group = new Sync<GroupModel>('groups');
  job = new Sync<JobModel>('jobs');
  media = new Sync<MediaModel>('medias');
  member = new Sync<MemberModel>('members');
  
  applicationColl = new PbColl<ApplicationModel>('applications');
  userColl = new PbAuthColl<UserModel>('users');

  constructor() {
    app.api = this;
  }
  
  initPbUrl() {
    const host = location.host;
    const pbClient = getPbClient();
    log.d('host', host);
    if (host.includes(':')) {
      const prevApiUrl = pbClient.getApiUrl();
      log.d('prevApiUrl', prevApiUrl);
      if (!prevApiUrl) {
        const nextApiUrl = 'https://i.m4k.fr/api/';
        log.d('set url', prevApiUrl, nextApiUrl);
        pbClient.setApiUrl(nextApiUrl);
      }
    }
  };


  getGroupId() {
    return this.groupId$.get();
  }

  needGroupId() {
    const id = this.getGroupId();
    if (!isStringValid(id)) throw toError('no group id');
    return id;
  }

  needAuthId() {
    const id = this.pb.getAuthId();
    if (!isStringValid(id)) throw toError('no group id');
    return id;
  }
  
  getMediaDownloadUrl(mediaOrId?: string | MediaModel) {
    let url = '';
    const media = isString(mediaOrId) ? this.media.get(mediaOrId) : mediaOrId;
    if (media) {
      const variants = this.getVariants(media);
      const videos = variants.filter((v) => v.type === 'video');
      if (videos.length) url = this.getMediaUrl(videos[0]);
      else {
        const images = variants.filter((v) => v.type === 'image');
        if (images.length) url = this.getMediaUrl(images[0]);
      }
      if (url) url = setUrlParams(url, { download: '1' });
    }
    return url;
  }

  getVariants(media?: MediaModel): Variant[] {
    if (!media || !media.data) return [];
    const results: Variant[] = [];
    media.data?.variants?.forEach((info, i) => {
      if (!media.variants) return;
      const file = media.variants[i];
      if (isStringValid(file) && info.mime) {
        results.push({ ...info, file, media, mime: info.mime });
      }
    });
    if (isStringValid(media.source) && media.mime && media.type && media.bytes !== undefined) {
      const file = media.source;
      results.push({ ...media, file, media, mime: media.mime, type: media.type, bytes: media.bytes });
    }
    return results;
  }

  getMediaUrl(
    v?: Variant,
    thumb?: string | number,
    download?: boolean,
    params?: Dictionary<string>
  ) {
    return (v && this.media.coll.getFileUrl(v.media.id, v.file, thumb, download, params)) || '';
  }

  startMediaDownload(mediaOrId?: string | MediaModel) {
    const media = isString(mediaOrId) ? this.media.get(mediaOrId) : mediaOrId;
    if (!media) return;
    const url = this.getMediaDownloadUrl(media);
    const ext = getExt(url);
    const filename = removeAccents(media.title || String(media.source) || media.id).trim() + '.' + ext;
    startDownload(url, filename);
  }
}