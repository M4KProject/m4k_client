import { Api } from '@/api/Api';
import { Media, ModelCreate } from '@/api/models';
import { createWindow } from '@/components/common/Window';
import { getSingleton } from '@/utils/ioc';
import {
  byId,
  flux,
  fluxCombine,
  fluxDictionary,
  isItem,
  isNumber,
  logger,
  toNumber,
  toVoid,
} from 'fluxio';
import { Router } from './Router';

export class MediaController {
  log = logger('MediaController');

  api = getSingleton(Api);
  router = getSingleton(Router);

  select$ = flux<Media | undefined>(undefined);
  medias$ = flux<Media[]>([]);
  mediaById$ = fluxDictionary<Media>(this.medias$.map((medias) => byId(medias)));

  parent$ = fluxCombine(this.select$, this.mediaById$).map(([select, mediaById]) => {
    if (select) {
      if (select.type === 'folder') return select;
      if (select.parentId) return mediaById[select.parentId];
    }
    return undefined;
  });

  breadcrumb$ = fluxCombine(this.select$, this.mediaById$).map(([select, mediaById]) => {
    let node = select;
    const results: Media[] = [];
    while (node) {
      results.push(node);
      node = node.parentId ? mediaById[node.parentId] : undefined;
    }
    return results.reverse();
  });

  constructor() {}

  click(media: Media) {
    return () => this.select$.set(media);
  }

  back = () => {
    this.parent$.set((parent) => this.getParent(parent));
  };

  getName(name: string = 'sans nom'): string {
    console.debug('getName', name);
    let i = 1;
    const start = name.replace(/ \(([0-9]+)\)$/, (_, v) => {
      const n = toNumber(v);
      if (isNumber(n)) i = n;
      return '';
    });
    console.debug('getName start', name, start, i);
    const medias = this.medias$.get();
    while (true) {
      if (!medias.find((m) => m?.name === name)) break;
      name = i === 1 ? start : `${start} (${i})`;
      i++;
    }
    console.debug('getName end', name, start, i);
    return name;
  }

  getParent(media?: Media) {
    const parentId = media?.parentId;
    return parentId ? this.mediaById$.getItem(parentId) : undefined;
  }

  prepare(media: ModelCreate<Media>): ModelCreate<Media> {
    return {
      ...media,
      name: this.getName(
        media.name ||
          (media.type === 'folder' ? 'Nouveau Dossier'
          : media.type === 'content' ? 'Nouveau Contenu'
          : 'Nouveau')
      ),
      userId: media.userId || this.api.needAuthUserId(),
      groupId: media.groupId || this.router.needGroupId(),
      parentId: media.parentId || this.parent$.get()?.id,
    };
  }

  create(media: ModelCreate<Media>) {
    return this.api.medias.create(this.prepare(media));
  }

  update(media: Media | string, changes: Partial<ModelCreate<Media>>) {
    const id = isItem(media) ? media.id : media;
    return this.api.medias.update(id, changes);
  }

  addFolder = () => this.create({ type: 'folder', name: 'Dossier' });

  addContent = () => this.create({ type: 'content', name: 'Contenu' });

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
  };

  edit = () => {
    const media = this.select$.get();
    this.log.d('edit', media);

    if (!media) return;

    this.router.go({
      page: 'edit',
      media: media.id,
    });
  };

  delete = () => {
    const media = this.select$.get();
    this.log.d('delete', media);

    if (!media) return;

    createWindow({
      modal: true,
      title: 'Êtes-vous sûr ?',
      content: `Êtes-vous sûr de vouloir supprimer le fichier multimédia : « ${media.name} » ?`,
      yes: () => {
        if (media.type === 'folder') this.back();
        const id = isItem(media) ? media.id : media;
        this.api.medias.remove(id);
      },
      cancel: toVoid,
      size: [350, 150],
      min: [200, 200],
    });
  };
}
