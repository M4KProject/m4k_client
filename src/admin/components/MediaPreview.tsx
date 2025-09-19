import { Css } from '@common/ui';
import { useCss } from '@common/hooks';
import { Div } from '@common/components';
import { collMedias } from '@common/api/collMedias';
import { MediaModel } from '@common/api/models';

const css: Css = {
  '&': {
    position: 'absolute',
    xy: '50%',
    wh: '100%',
    translate: '-50%, -50%',
    bgMode: 'contain',
    transition: 0.2,
    userSelect: 'none',
    pointerEvents: 'none',
  },
  '&:hover': {
    xy: '50%',
    wh: 15,
    zIndex: 1,
    translate: '-50%, -50%',
    // bg: 'primary',
    // border: 'primary',
    // borderWidth: '0.5em',
    rounded: 1,
  },
};

export const MediaPreview = ({ media }: { media: MediaModel }) => {
  const c = useCss('MediaPreview', css);

  return (
    <Div
      cls={c}
      style={{
        backgroundImage: `url("${collMedias.getThumbUrl(media.id, media.source, [300, 300])}")`,
      }}
    />
  );
};
