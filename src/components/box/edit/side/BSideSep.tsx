import { Css } from 'fluxio';
import { DivProps } from '@/components/common/types';

const c = Css('BSideContent', {
  '': {
    my: 8,
    w: '100%',
    h: 2,
    bg: 'border',
  },
});

export const BSideSep = (props: DivProps) => <div {...props} {...c('', props)} />;