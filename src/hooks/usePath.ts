import { useMemo } from 'preact/hooks';
import { getUrlParams } from 'fluxio';

export type Page = '' | 'account' | 'groups' | 'members' | 'devices' | 'medias' | 'jobs' | 'edit';

export interface PathParams {
  group?: string;
  page?: Page;
  media?: string;
}

export const useUrlParams = () => {
  return useMemo(() => getUrlParams(), []);
};

export const usePath = (): PathParams => {
  const params = useUrlParams();

  return useMemo(() => {
    const path = params.path;
    if (!path) return {};

    const segments = path.split('/').filter(s => s);

    return {
      group: segments[0],
      page: segments[1] as Page,
      media: segments[2],
    };
  }, [params.path]);
};
