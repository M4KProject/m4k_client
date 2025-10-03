import { Css } from '@common/ui';
import { MediaModel } from '@common/api';
import { DivProps } from '@common/components';
import { PlaylistView } from './PlaylistView';
import { VideoView } from './VideoView';
import { PdfView } from './PdfView';
import { ImageView } from './ImageView';
import { PageView } from './PageView';

export type MediaFit = 'contain' | 'cover' | 'fill';
export type MediaAnim = 'rightToLeft' | 'topToBottom' | 'fade' | 'zoom';

const c = Css('MediaView', {
  '': {
    position: 'absolute',
    overflow: 'hidden',
    fCenter: 1,
    wh: '100%',
    xy: 0,
  },
});

export interface MediaConfig {
  fit?: MediaFit;
  anim?: MediaAnim;
  seconds?: number;
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
  const { media } = props;
  const type = media?.type || 'empty';
  const Content = contentByType[type] || EmptyView;

  return <Content {...(props as MediaViewProps<any>)} class={c('', `-${type}`, props)} />;
};
