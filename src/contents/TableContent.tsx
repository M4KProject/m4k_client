
import { Css, flexColumn } from '@common/ui';
import { Div } from '@common/components';
import type { ContentProps } from './ContentViewer';

const css = Css('TableContent', {
  '&': {
    ...flexColumn({ align: 'center', justify: 'center' }),
    minHeight: '100vh',
    p: 2,
  },
  '&Message': {
    fontSize: 1.2,
    color: '#666',
    textAlign: 'center',
  },
});

export const TableContent = ({ content }: ContentProps) => {
  return (
    <Div  cls={css()}>
      <Div cls={css(`Message`)}>
        <h2>Tableau: {content.title}</h2>
        <p>Affichage des tableaux en cours de développement</p>
      </Div>
    </Div>
  );
};
