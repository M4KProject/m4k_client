import { Css } from 'fluxio';
import { comp, Comp } from '@/utils/comp';
import { DivProps } from '@/components/common/types';

const c = Css('Panel', {
  '': {
    col: ['stretch', 'start'],
    flex: 1,
    m: 8,
    elevation: 1,
    rounded: 5,
    overflow: 'hidden',
  },
  Header: {
    bg: 'p',
    fg: 'barFg',
    bold: 1,
    row: ['center', 'start'],
    h: 32,
  },
  'Header svg': {
    mx: 8,
  },
  Content: {},
});

export interface PanelProps extends DivProps {
  icon: Comp;
  title: string;
}

export const Panel = ({ icon, title, children, ...props }: PanelProps) => {
  return (
    <div {...props} {...c('', props)}>
      <div {...c('Header')}>
        {comp(icon)}
        {title}
      </div>
      <div {...c('Content')}>{children}</div>
    </div>
  );
};
