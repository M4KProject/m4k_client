
import { Css, flexColumn } from '@common/ui';
import { Div } from '@common/components';
import type { ContentProps } from './ContentViewer';

const css = Css('FormContent', {
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

export const FormContent = ({ content }: ContentProps) => {
  return (
    <Div  cls={css()}>
      <Div cls={css(`Message`)}>
        <h2>Formulaire: {content.title}</h2>
        <p>Affichage des formulaires en cours de développement</p>
      </Div>
    </Div>
  );
};
