import { Css } from 'fluxio';
import { DivProps } from './types';
import { Tr } from './Tr';
import { addTr } from '../hooks/useTr';

const c = Css('Loading', {
  '': {
    w: '100%',
    h: '100%',
    center: 1,
  },
  Content: {
    ml: 4,
  },

  Spinner: {
    center: 1,
  },
  SpinnerCircle: {
    w: 5,
    h: 5,
    bg: 'p5',
    rounded: 50,
    center: 1,
  },
  SpinnerIcon: {
    w: 2.5,
    h: 2.5,
    border: 3,
    borderColor: 'w1',
    borderTop: 'transparent',
    rounded: 50,
    anim: {
      name: 'spin',
      duration: '1s',
      timing: 'linear',
      count: 'infinite',
      keyframes: {
        '0%': { transform: { rotate: 0 } },
        '100%': { transform: { rotate: 360 } },
      },
    },
  },
});

addTr({
  loading: 'Chargement...',
});

export const LoadingSpinner = (props: DivProps) => (
  <div {...props} {...c('Spinner', props)}>
    <div {...props} {...c('SpinnerCircle', props)}>
      <div {...c('SpinnerIcon')} />
    </div>
  </div>
);

export const Loading = ({ content, children, ...props }: DivProps & { content?: string }) => {
  return (
    <div {...props} {...c('', props)}>
      <LoadingSpinner />
      {content !== '' && (
        <div {...c('Content')}>
          <Tr>{content || 'loading'}</Tr>
        </div>
      )}
      {children}
    </div>
  );
};
