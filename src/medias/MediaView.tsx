import { Css } from 'fluxio';
import { Dictionary } from 'fluxio';
import { JSX } from 'preact';
import { DivProps } from '../components/types';
import { MediaAnim, MediaFit, MediaModel } from '@/api/models';

const c = Css('MediaView', {
  '': {
    position: 'absolute',
    overflow: 'hidden',
    center: 1,
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

  '-toLeft-': { transform: 'translateX(0%)' },
  '-toLeft&-prev': { transform: 'translateX(-100%)' },
  '-toLeft&-next': { transform: 'translateX(+100%)' },

  '-toBottom': { transform: 'translateY(0%)' },
  '-toBottom&-prev': { transform: 'translateY(+100%)' },
  '-toBottom&-next': { transform: 'translateY(-100%)' },

  '-zoom': { transform: 'scale(1)' },
  '-zoom&-prev': { transform: 'scale(0)' },
  '-zoom&-next': { transform: 'scale(0)' },

  '-contain': { bgMode: 'contain' },
  '-cover': { bgMode: 'cover' },
  '-fill': { bgMode: 'fill' },
});

export interface MediaViewProps<T extends MediaModel = any> {
  media: T;
  mediaById: Dictionary<MediaModel>;
  fit?: MediaFit;
  anim?: MediaAnim;
  seconds?: number;
  pos?: 'hidden' | 'prev' | 'curr' | 'next';
  onNext?: () => void;
  divProps?: DivProps;
}

export const EmptyView = ({ media, divProps }: MediaViewProps) => {
  return (
    <div {...divProps} {...c(divProps)}>
      Type de média non supporté: {media.type}
    </div>
  );
};

const compByType: Record<string, (props: MediaViewProps) => JSX.Element | null> = {};

export const addComp = (type: string, comp: (props: MediaViewProps) => JSX.Element | null) => {
  compByType[type] = comp;
};

export const getComp = (type: string) => compByType[type] || EmptyView;

export const MediaView = (props: MediaViewProps) => {
  const { media, anim, pos, fit, divProps } = props;
  const type = media.type || 'empty';
  const Comp = getComp(type);

  return (
    <Comp
      {...props}
      divProps={{
        ...divProps,
        ...c(
          '',
          type && `-${type}`,
          fit && `-${fit}`,
          pos && `-${pos}`,
          anim && `-${anim}`,
          divProps
        ),
      }}
    />
  );
};
