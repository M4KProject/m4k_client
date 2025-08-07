import { useCss } from '@common/hooks';
import { Css, flexColumn } from '@common/helpers';
import { Div } from '@common/components';
import { ContentProps } from './ContentViewer';

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

export const PlaylistContent = ({ content }: ContentProps) => {
  const c = useCss('PlaylistContent', css);
  
  return (
    <Div cls={`${c}`}>
      <Div cls={`${c}Message`}>
        <h2>Playlist: {content.title}</h2>
        <p>Affichage des playlists en cours de développement</p>
      </Div>
    </Div>
  );
};