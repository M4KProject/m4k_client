import { useCss } from '@common/hooks';
import { Css, flexColumn } from '@common/helpers';
import { Div } from '@common/components';
import type { ContentProps } from './ContentViewer';
import { PlaylistContentModel } from '@common/api';

const css: Css = {
  '&': {
    ...flexColumn({ align: 'center', justify: 'center' }),
    minHeight: '100vh',
    p: 2,
  },
  '&Message': {
    fontSize: 1.2,
    color: '#666',
    textAlign: 'center',
  }
};

export const PlaylistContent = ({ content }: ContentProps<PlaylistContentModel>) => {
  const c = useCss('PlaylistContent', css);

  console.debug('PlaylistContent', content, content.data.items[0].media);

  // const item = content.data.items[0];
  
  return (
    <Div cls={`${c}`}>
      <Div cls={`${c}Message`}>
        <h2>Playlist: {content.title}</h2>
        <p>Affichage des playlists en cours de développement</p>
      </Div>
    </Div>
  );
};