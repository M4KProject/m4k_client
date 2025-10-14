import { mediaSync } from '@/api/sync';

export const getNextTitle = (start: string) => {
  const medias = mediaSync.filter();
  let i = 1;
  let title = start;
  while (true) {
    if (!medias.find((m) => m?.title === title)) break;
    title = start + ++i;
  }
  return title;
};
