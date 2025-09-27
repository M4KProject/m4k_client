import { mediaCtrl } from '@/handlers';

export const getNextTitle = (start: string) => {
  const medias = mediaCtrl.filter();
  let i = 1;
  let title = start;
  while (true) {
    if (!medias.find((m) => m.title === title)) break;
    title = start + ++i;
  }
  return title;
};
