import { Css } from '@common/ui';
import { useCss } from '@common/hooks';
import { Div } from '@common/components';
import { collMedias } from '@common/api/collMedias';
import { FileInfo, MediaModel } from '@common/api/models';
import { useState } from 'preact/hooks';
import { first, isStrNotEmpty } from '@common/utils';

const css: Css = {
  '&': {
    position: 'absolute',
    xy: '50%',
    wh: '100%',
    translate: '-50%, -50%',
    bgMode: 'contain',
    transition: 0.2,
    userSelect: 'none',
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
  '& video': {
    wh: '100%',
  }
};

interface Variant extends FileInfo {
  media: MediaModel;
  file: string;
}

const getVariants = (media?: MediaModel): Variant[] => {
  if (!media || !media.data) return [];
  const results = [];
  media.data.variants.forEach((info, i) => {
    const file = media.variants[i];
    if (isStrNotEmpty(file)) {
      results.push({ ...info, file, media });
    }
  });
  if (isStrNotEmpty(media.source)) {
    const file = media.source;
    results.push({ ...media, file, media });
  }
  return results;
}

const getThumbUrl = (v?: Variant) => v && collMedias.getThumbUrl(v.media.id, v.file, [300, 300]) || '';
const getUrl = (v?: Variant) => v && collMedias.getUrl(v.media.id, v.file) || '';

export const MediaPreview = ({ media }: { media: MediaModel }) => {
  const c = useCss('MediaPreview', css);

  const variants = getVariants(media);

  const images = variants.filter(v => v.type === 'image');
  const videos = variants.filter(v => v.type === 'video');

  const [isOver, setIsOver] = useState(false);
  
  return (
    <Div
      cls={c}
      onMouseOver={() => {
        console.debug('onMouseOver', media.id);
        setIsOver(true);
      }}
      onMouseLeave={() => {
        console.debug('onMouseLeave', media.id);
        setIsOver(false);
      }}
      style={{
        backgroundImage: `url("${getThumbUrl(images[0])}")`,
      }}
    >
      {(isOver && videos.length) ? (
        <video controls muted autoPlay>
          {videos.map(v => (
            <source type={v.mime} src={getUrl(v)} />
          ))}
        </video>
      ) : null}
    </Div>
  );
};
