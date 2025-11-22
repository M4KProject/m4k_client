import { Api } from '@/api/Api';

export const getNextTitle = (api: Api, start: string) => {
  const medias = api.media.filter();
  let i = 1;
  let title = start;
  while (true) {
    if (!medias.find((m) => m?.title === title)) break;
    title = start + ++i;
  }
  return title;
};
