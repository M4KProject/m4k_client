import { Css } from '@common/ui';
import { PlaylistModel, FolderModel } from '@common/api';
import { DivProps } from '@common/components';
import { useState } from 'preact/hooks';
import { useTimeout } from '@common/hooks';
import { MediaConfig, MediaView } from './MediaView';

const c = Css('PlaylistView', {});

export type PlaylistViewProps = DivProps &
  MediaConfig & {
    media?: PlaylistModel | FolderModel;
    go?: (index: number) => void;
  };

export const PlaylistView = ({
  media,
  seconds = 5,
  anim = 'fade',
  fit = 'contain',
  go,
  ...props
}: PlaylistViewProps) => {
  const [index, setIndex] = useState(0);

  const data = media?.data || {};
  const items = data.items || (media?.deps || []).map((id) => ({ media: id }));
  const length = items.length;

  const curr = index % length;
  const prev = (curr - 1 + length) % length;
  const next = (curr + 1) % length;

  const gotoNext = () => {
    setIndex(next);
    go?.(next);
  };

  useTimeout(length > 0 ? gotoNext : null, seconds * 1000, [index]);

  if (!media || length === 0) return null;

  return (
    <div {...props} class={c('', props)}>
      {items.map((item: any, itemIndex: number) => {
        const pos =
          itemIndex === curr
            ? 'curr'
            : itemIndex === next
              ? 'next'
              : itemIndex === prev
                ? 'prev'
                : 'hidden';

        return (
          <MediaView
            key={itemIndex}
            media={item}
            fit={fit}
            anim={anim}
            pos={pos}
            seconds={item.seconds || seconds}
            onNext={gotoNext}
          />
        );
      })}
    </div>
  );
};
