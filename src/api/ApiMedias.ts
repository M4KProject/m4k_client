import { ApiSync } from "./ApiSync";
import { ImageMedia, Media, MediaFormat, MediaType } from "./models";

export class ApiMedias extends ApiSync<Media> {
  getFileInfos(media: Media, type: MediaType, format: MediaFormat = '', download?: boolean) {
    let infos = (media as ImageMedia).data?.files || [];
    infos = infos.filter((v) => v.type === type);
    return infos.map(info => ({
      ...info,
      url: this.client.getFileUrl(info.path, format, download),
    }));
  }

  getImageInfos(media: Media, format: MediaFormat, download?: boolean) {
    return this.getFileInfos(media, 'image', format, download);
  }

  getImageUrl(media: Media, format: MediaFormat, download?: boolean) {
    return this.getFileInfos(media, 'image', format, download)[0];
  }

  getVideoInfos(media: Media, format: MediaFormat, download?: boolean) {
    return this.getFileInfos(media, 'video', format, download);
  }
}