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
    bg: 'header',
    fg: 'headerFg',
    bold: 1,
    row: ['center', 'start'],
    h: 32,
  },
  'Header svg': {
    mx: 8,
  },
  Content: {
    flex: 1,
    bg: 'bg',
  },
});

export interface PanelProps extends DivProps {
  icon?: Comp;
  header?: Comp;
}

export const Panel = ({ icon, header, children, ...props }: PanelProps) => {
  return (
    <div {...props} {...c('', props)}>
      <div {...c('Header')}>
        {comp(icon)}
        {comp(header)}
      </div>
      <div {...c('Content')}>{children}</div>
    </div>
  );
};
