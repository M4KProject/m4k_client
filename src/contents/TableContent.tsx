import { Css } from '@common/ui';

import type { ContentProps } from './ContentViewer';

const c = Css('TableContent', {
  '': {
    fCenter: 1,
    minHeight: '100vh',
    p: 2,
  },
  Message: {
    color: '#666',
    textAlign: 'center',
  },
});

export const TableContent = ({ content }: ContentProps) => {
  return (
    <div class={c()}>
      <div class={c('Message')}>
        <h2>Tableau: {content.title}</h2>
        <p>Affichage des tableaux en cours de développement</p>
      </div>
    </div>
  );
};
