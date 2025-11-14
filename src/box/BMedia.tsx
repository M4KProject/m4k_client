import { Css } from 'fluxio';
import { BComp } from './bTypes';
import { MediaView } from '../medias/MediaView';
import { useMedia, useMediaById } from '@/hooks/apiHooks';

const c = Css('BMedia', {
  '': {
    wh: '100%',
  }
})

export const BMedia: BComp = ({ i, item, props, ctrl }) => {
  console.debug('BMedia', i, item, props, ctrl);
  const media = useMedia(item.media);
  const mediaById = useMediaById();

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