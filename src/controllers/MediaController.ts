import { createWindow } from '@/components/common/Window';
import {
  byId,
  flux,
  fluxCombine,
  fluxDictionary,
  isNumber,
  logger,
  notImplemented,
  toNumber,
  toVoid,
} from 'fluxio';
import { api2, MCreate, MMedia, MUpdate } from '@/api2';

export class MediaController {
  log = logger('MediaController');

  select$ = flux<MMedia | undefined>(undefined);
  medias$ = flux<MMedia[]>([]);
  mediaById$ = fluxDictionary<MMedia>(this.medias$.map((medias) => byId(medias)));

  parent$ = fluxCombine(this.select$, this.mediaById$).map(([select, mediaById]) => {
    if (select) {
      if (select.type === 'folder') return select;
      if (select.parentId) return mediaById[select.parentId];
    }
    return undefined;
  });

  breadcrumb$ = fluxCombine(this.select$, this.mediaById$).map(([select, mediaById]) => {
    let node = select;
    const results: MMedia[] = [];
    while (node) {
      results.push(node);
      node = node.parentId ? mediaById[node.parentId] : undefined;
    }
    return results.reverse();
  });

  constructor() {}

  click(media: MMedia) {
    return () => this.select$.set(media);
  }

  back = () => {
    this.parent$.set((parent) => this.getParent(parent));
  };

  getNextName(name: string) {
    this.log.d('getNextName', name);
    let i = 1;
    const start = (name || 'sans nom').replace(/ \(([0-9]+)\)$/, (_, v) => {
      const n = toNumber(v);
      if (isNumber(n)) i = n;
      return '';
    });
    this.log.d('getNextName start', name, start, i);
    const medias = this.medias$.get();
    while (true) {
      if (!medias.find((m) => m?.name === name)) break;
      name = i === 1 ? start : `${start} (${i})`;
      i++;
    }
    this.log.d('getNextName end', name, start, i);
    return name;
  }

  getParent(media?: MMedia) {
    const parentId = media?.parentId;
    return parentId ? this.mediaById$.getItem(parentId) : undefined;
  }

  prepare(media:Partial<MCreate<MMedia>>): MCreate<MMedia> {
    return {
      ...media,
      type: media.type || 'unknown',
      name: this.getNextName(
        media.name ||
          (media.type === 'folder' ? 'Nouveau Dossier'
          : media.type === 'content' ? 'Nouveau Contenu'
          : 'Nouveau')
      ),
      userId: media.userId || api2.needUserId(),
      groupId: media.groupId || api2.needGroupId(),
      parentId: media.parentId || this.parent$.get()?.id,
    };
  }

  create(media: Partial<MCreate<MMedia>>) {
    return api2.medias.create(this.prepare(media));
  }

  update(media: MMedia | string, changes: MUpdate<MMedia>) {
    return api2.medias.update(media, changes);
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
  };

  edit = () => {
    const media = this.select$.get();
    this.log.d('edit', media);

    if (!media) return;

    throw notImplemented('edit');
    // this.router.go({
    //   page: 'edit',
    //   media: media.id,
    // });
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
        api2.medias.remove(media);
      },
      cancel: toVoid,
      size: [350, 150],
      min: [200, 200],
    });
  };
}
