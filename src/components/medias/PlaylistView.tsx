import { Css } from '@common/ui';
import { PlaylistEntry, PlaylistModel } from '@common/api';
import { useState } from 'preact/hooks';
import { useTimeout } from '@common/hooks';
import { MediaView, MediaViewProps } from './MediaView';
import { isNotEmpty } from '@common/utils';

const c = Css('PlaylistView', {});

export type PlaylistViewProps = MediaViewProps<PlaylistModel>;

export const PlaylistView = ({ media, mediaById, fit, anim, divProps }: PlaylistViewProps) => {
  const [index, setIndex] = useState(0);

  const data = media.data || {};
  const dataItems = data.items || (media?.deps || []).map((id) => ({ media: id }) as PlaylistEntry);
  const items = dataItems
    .map((d): MediaViewProps | undefined => {
      const media = mediaById[d.media!];
      if (!media) return undefined;
      return {
        media,
        fit: d.fit || fit,
        anim: d.anim || anim,
        seconds: d.seconds || media.seconds || 5,
        mediaById,
      };
    })
    .filter(isNotEmpty);

  const length = items.length;
  const curr = index % length;
  const prev = (curr - 1 + length) % length;
  const next = (curr + 1) % length;

  items.forEach((item, i) => {
    if (item)
      item.pos =
        i === curr ? 'curr'
        : i === next ? 'next'
        : 'prev';
  });

  const gotoNext = () => {
    setIndex(next);
  };

  const seconds = (items && items[curr]?.seconds) || 5;
  useTimeout(length > 0 ? gotoNext : null, seconds * 1000, [seconds, curr]);

  if (!media || length === 0) return null;

  return (
    <div {...divProps} class={c('', divProps)}>
      {items.map((item: any, i: number) => {
        return <MediaView key={item.id} {...item} onNext={gotoNext} />;
      })}
    </div>
  );
};
