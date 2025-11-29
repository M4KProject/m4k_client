import { Api } from "@/api/Api";
import { MediaModel } from "@/api/models";
import { createWindow } from "@/components/common/Window";
import { getSingleton } from "@/utils/ioc";
import { byId, flux, fluxCombine, fluxDictionary, isNumber, logger, toNumber, toVoid } from "fluxio";
import { PbCreate } from "pblite";
import { Router } from "./Router";

export class MediaController {
  log = logger('MediaController');

  api = getSingleton(Api);
  router = getSingleton(Router);

  select$ = flux<MediaModel|undefined>(undefined);
  medias$ = flux<MediaModel[]>([]);
  mediaById$ = fluxDictionary<MediaModel>(this.medias$.map(medias => byId(medias)));

  parent$ = fluxCombine(this.select$, this.mediaById$).map(([select, mediaById]) => {
    if (select) {
      if (select.type === 'folder') return select;
      if (select.parent) return mediaById[select.parent];
    }
    return undefined;
  });

  breadcrumb$ = fluxCombine(this.select$, this.mediaById$).map(([select, mediaById]) => {
    let node = select;
    const results: MediaModel[] = [];
    while (node) {
      results.push(node);
      node = node.parent ? mediaById[node.parent] : undefined;
    }
    return results.reverse();
  });
  
  click(media: MediaModel) {
    return () => this.select$.set(media);
  }

  back = () => {
    this.parent$.set(parent => this.getParent(parent));
  }

  getTitle(title?: string) {
    console.debug('getNextTitle', title);
    let i = 1;
    const start = (title||'sans nom').replace(/ \(([0-9]+)\)$/, (_,v) => {
      const n = toNumber(v);
      if (isNumber(n)) i = n;
      return '';
    });
    console.debug('getNextTitle start', title, start, i);
    const medias = this.medias$.get();
    while (true) {
      if (!medias.find((m) => m?.title === title)) break;
      title = i === 1 ? start : `${start} (${i})`;
      i++;
    }
    console.debug('getNextTitle end', title, start, i);
    return title;
  }

  getParent(media?: MediaModel) {
    const parentId = media?.parent;
    return parentId ? this.mediaById$.getItem(parentId) : undefined;
  }

  prepare(media: PbCreate<MediaModel>): PbCreate<MediaModel> {
    return {
      ...media,
      title: this.getTitle(media.title || (
        media.type === 'folder' ? 'Nouveau Dossier' :
        media.type === 'content' ? 'Nouveau Contenu' :
        'Nouveau'
      )),
      user: media.user || this.api.needAuthId(),
      group: media.group || this.router.needGroupId(),
      parent: media.parent || this.parent$.get()?.id,
    };
  }

  create(media: PbCreate<MediaModel>) {
    return this.api.media.create(this.prepare(media));
  }

  update(media: MediaModel|string, changes: Partial<PbCreate<MediaModel>>) {
    return this.api.media.update(media, changes);
  }

  addFolder = () => this.create({ type: 'folder' });

  addContent = () => this.create({ type: 'content' });

  upload = (files: File[]) => {
    // (files) => {
    // if (media?.type === 'playlist') {
    //   uploadMedia(api, files, media.parent ? mediaById[media.parent] : undefined, media);
    //   return;
    // }
    // if (media?.type === 'folder') {
    //   uploadMedia(api, files, media);
    //   return;
    // }
    // uploadMedia(api, files);
  }

  edit = () => {
    const media = this.select$.get();
    this.log.d('edit', media);

    if (!media) return;

    this.router.go({
      page: 'edit',
      media: media.id,
    });
  }

  delete = () => {
    const media = this.select$.get();
    this.log.d('delete', media);

    if (!media) return;

    createWindow({
      modal: true,
      title: "Êtes-vous sûr ?",
      content: `Êtes-vous sûr de vouloir supprimer le fichier multimédia : « ${media.title} » ?`,
      yes: () => {
        if (media.type === 'folder') this.back();
        this.api.media.delete(media);
      },
      cancel: toVoid,
      size: [350,150],
      min: [200,200],
    });
  }
}
