import { byId, Css } from 'fluxio';
import { BComp } from './bTypes';
import { useMedias, useApi } from '@/hooks/useApi';
import { useFlux } from '@/hooks/useFlux';
import { addComp, MediaView } from '@/components/medias/MediaView';
import { ImageView } from '../medias/ImageView';
import { VideoView } from '../medias/VideoView';
import { PlaylistView } from '../medias/PlaylistView';
import { PdfView } from '../medias/PdfView';

addComp('image', ImageView);
addComp('video', VideoView);
addComp('playlist', PlaylistView);
addComp('pdf', PdfView);

const c = Css('BMedia', {
  '': { wh: '100%' },
});

export const BMedia: BComp = ({ i, item, props }) => {
  console.debug('BMedia', i, item, props);
  const mediaId = item.m;
  const medias = useMedias();
  const mediaById = byId(medias);
  const media = mediaId ? mediaById[mediaId] : undefined;

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
