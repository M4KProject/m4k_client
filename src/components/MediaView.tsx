import { Css } from '@common/ui';
import { MediaModel } from '@common/api';
import { DivProps } from '@common/components';
import { firstUpper } from '@common/utils';
import { PlaylistView } from './PlaylistView';
import { VideoView } from './VideoView';
import { PdfView } from './PdfView';
import { ImageView } from './ImageView';
import { PageView } from './PageView';

export type MediaFit = 'contain' | 'cover' | 'fill';
export type MediaAnim = 'toLeft' | 'toBottom' | 'fade' | 'zoom';

const c = Css('MediaView', {
  '': {
    position: 'absolute',
    overflow: 'hidden',
    fCenter: 1,
    wh: '100%',
    xy: 0,
    transition: 0.3,
    zIndex: 1,
    bgMode: 'cover',
  },
  '-hidden': { visibility: 'hidden', opacity: 0 },
  '-prev': { zIndex: 3, opacity: 0 },
  '-next': { zIndex: 2, opacity: 0 },
  '-curr': { zIndex: 4, opacity: 1 },

  '-toLeftPrev': { transform: 'translateX(-100%)' },
  '-toLeftNext': { transform: 'translateX(+100%)' },

  '-toBottomPrev': { transform: 'translateY(+100%)' },
  '-toBottomNext': { transform: 'translateY(-100%)' },

  '-fadePrev': { opacity: 0 },
  '-fadeNext': { opacity: 0 },

  '-zoomPrev': { transform: 'scale(0)' },
  '-zoomNext': { transform: 'scale(0)' },

  '-contain': { bgMode: 'contain' },
  '-cover': { bgMode: 'cover' },
  '-fill': { bgMode: 'fill' },
});

export interface MediaConfig {
  fit?: MediaFit;
  anim?: MediaAnim;
  seconds?: number;
  pos?: 'hidden' | 'prev' | 'curr' | 'next';
  onNext?: () => void;
}

export type MediaViewProps<T extends MediaModel = MediaModel> = DivProps &
  MediaConfig & {
    media?: T;
  };

export const EmptyView = (props: MediaViewProps) => {
  return (
    <div {...props} class={c(props)}>
      Type de média non supporté: {props.media?.type}
    </div>
  );
};

const contentByType = {
  playlist: PlaylistView,
  folder: PlaylistView,
  video: VideoView,
  pdf: PdfView,
  image: ImageView,
  page: PageView,
};

export const MediaView = (props: MediaViewProps) => {
  const { media, fit, anim, pos } = props;
  const type = media?.type || 'empty';
  const Content = contentByType[type] || EmptyView;

  const getAnimClass = () => {
    if (!anim || !pos || pos === 'hidden' || pos === 'curr') return null;
    return `-${anim}${firstUpper(pos)}`;
  };

  return (
    <Content
      {...(props as MediaViewProps<any>)}
      class={c('', type && `-${type}`, fit && `-${fit}`, pos && `-${pos}`, getAnimClass(), props)}
    />
  );
};
