import { fluxCombine, isInt, pInt } from "fluxio";
import { ApiRest } from "./ApiRest";
import { MImage, MMedia, MFormat, MMediaType, MCreate, MOptions, MId } from "./models";

export class ApiMedias extends ApiRest<MMedia> {
  breadcrumb$ = fluxCombine(this.item$, this.dico$).map(([item, mediaById]) => {
    let node = item;
    const results: MMedia[] = [];
    while (node) {
      results.push(node);
      node = node.parentId ? mediaById[node.parentId] : undefined;
    }
    return results.reverse();
  });

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
    return this.getFileInfos(media, 'image', format, download)[0]?.url;
  }

  getVideoInfos(media: MMedia, format: MFormat, download?: boolean) {
    return this.getFileInfos(media, 'video', format, download);
  }

  upload(): void {
    throw new Error('Method not implemented.');
  }

  edit(): void {
    throw new Error('Method not implemented.');
  }

  // nextKey(title: string) {
  //   this.log.d('getNextName', name);
  //   let i = 1;
  //   const start = (name || 'sans nom').replace(/ \(([0-9]+)\)$/, (_, v) => {
  //     const n = pInt(v);
  //     if (n) i = n;
  //     return '';
  //   });
  //   this.log.d('getNextName start', name, start, i);
  //   const medias = this.items$.get();
  //   while (true) {
  //     if (!medias.find((m) => m?.name === name)) break;
  //     name = i === 1 ? start : `${start} (${i})`;
  //     i++;
  //   }
  //   this.log.d('getNextName end', name, start, i);
  //   return name;
  // }

  // create(data: MCreate<MMedia>, options?: MOptions<MMedia, MMedia> | undefined) {
  //   return super.create(data, options);
  // }

  // prepare(media:Partial<MCreate<MMedia>>): MCreate<MMedia> {
  //   return {
  //     ...media,
  //     type: media.type || 'unknown',
  //     name: this.getNextName(
  //       media.name ||
  //         (media.type === 'folder' ? 'Nouveau Dossier'
  //         : media.type === 'content' ? 'Nouveau Contenu'
  //         : 'Nouveau')
  //     ),
  //     userId: media.userId || api2.needUserId(),
  //     groupId: media.groupId || api2.needGroupId(),
  //     parentId: media.parentId || this.parent$.get()?.id,
  //   };
  // }
  
}