import { Api } from "@/api/Api";
import { MediaModel } from "@/api/models";
import { getSingleton } from "@/utils/ioc";
import { byId, flux, fluxDictionary, logger } from "fluxio";
import { PbCreate } from "pblite";

export class MediaController {
  log = logger('MediaController');

  api = getSingleton(Api);

  parent$ = flux<MediaModel|undefined>(undefined);
  mediaById$ = fluxDictionary<MediaModel>();

  setMedias(medias: MediaModel[]) {
    this.mediaById$.set(byId(medias));
  }

  click(media: MediaModel) {
    return () => {
      const type = media.type;

      if (type === 'folder') {
        this.parent$.set(media);
        return;
      }
    }
  }

  back = () => {
    this.parent$.set(parent => this.getParent(parent));
  }

  upload = () => {

  }
  
  addFolder = () => {

  }

  addContent = () => {

  }

  getParent(media?: MediaModel) {
    const parentId = media?.parent;
    return parentId ? this.mediaById$.getItem(parentId) : undefined;
  }

  create(media: PbCreate<MediaModel>) {
    return this.api.media.create(media);
  }

  update(media: MediaModel|string, changes: Partial<PbCreate<MediaModel>>) {
    return this.api.media.update(media, changes);
  }
}
