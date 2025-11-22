import { Css } from 'fluxio';
import { BComp } from './bTypes';
import { useMediaById, useApi } from '@/hooks/apiHooks';
import { useFlux } from '@/hooks/useFlux';
import { MediaView } from '@/components/medias/MediaView';
import '@/admin/components/medias/registers';

const c = Css('BMedia', {
  '': { wh: '100%' },
});

export const BMedia: BComp = ({ i, item, props, ctrl }) => {
  console.debug('BMedia', i, item, props, ctrl);
  const mediaId = item.m;
  const api = useApi();
  const media = useFlux(mediaId ? api.media.find$(mediaId) : undefined);
  const mediaById = useMediaById();

  if (!media) {
    return (
      <div {...props} {...c('', props)}>
        {mediaId ? `Chargement du média ${mediaId}...` : 'Aucun média sélectionné'}
      </div>
    );
  }

  return (
    <div {...props} {...c('', props)}>
      <MediaView media={media} mediaById={mediaById} />
    </div>
  );
};

// fit?: MediaFit;
// anim?: MediaAnim;
// seconds?: number;
// pos?: 'hidden' | 'prev' | 'curr' | 'next';
// onNext?: () => void;
// divProps?: DivProps;
