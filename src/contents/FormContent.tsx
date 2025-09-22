import { Css, flexColumn } from '@common/ui';

import type { ContentProps } from './ContentViewer';

const c = Css('FormContent', {
  '': {
    ...flexColumn({ align: 'center', justify: 'center' }),
    minHeight: '100vh',
    p: 2,
  },
  Message: {
    fontSize: 1.2,
    color: '#666',
    textAlign: 'center',
  },
});

export const FormContent = ({ content }: ContentProps) => {
  return (
    <div class={c()}>
      <div class={c('Message')}>
        <h2>Formulaire: {content.title}</h2>
        <p>Affichage des formulaires en cours de développement</p>
      </div>
    </div>
  );
};
