import { Css } from '@common/ui';
import { MediaModel } from '@common/api';
import { DivProps } from '@common/components';
import { MediaConfig } from './MediaView';

const c = Css('PageView', {
  '': {
    position: 'absolute',
    overflow: 'hidden',
    fCenter: 1,
    wh: '100%',
    xy: 0,
  },
});

export type PageViewProps = DivProps &
  MediaConfig & {
    media?: MediaModel;
  };

export const PageView = (props: PageViewProps) => {
  return (
    <div {...props} class={c(props)}>
      TODO
    </div>
  );
};
