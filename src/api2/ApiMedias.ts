import { ApiRest } from "./ApiRest";
import { MImage, MMedia, MFormat, MMediaType } from "./models";

export class ApiMedias extends ApiRest<MMedia> {
  getFileInfos(media: MMedia, type: MMediaType, format: MFormat = '', download?: boolean) {
    let infos = (media as MImage).data?.files || [];
    infos = infos.filter((v) => v.type === type);
    return infos.map(info => ({
      ...info,
      url: this.client.getFileUrl(info.path, format, download),
    }));
  }

  getImageInfos(media: MMedia, format: MFormat, download?: boolean) {
    return this.getFileInfos(media, 'image', format, download);
  }

  getImageUrl(media: MMedia, format: MFormat, download?: boolean) {
    return this.getFileInfos(media, 'image', format, download)[0];
  }

  getVideoInfos(media: MMedia, format: MFormat, download?: boolean) {
    return this.getFileInfos(media, 'video', format, download);
  }
}