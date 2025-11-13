import { Css } from 'fluxio';
import { DivProps } from './types';
import { Tr } from './Tr';

const c = Css('Toolbar', {
  '': {
    bg: 'bg',
    fg: 't',
    px: 8,
    my: 0,
    elevation: 2,
    row: 1,
    hMin: 44,
    zIndex: 20,
  },
  Title: {
    fg: 't',
    flex: 1,
    bold: 1,
  },
});


export interface ToolbarProps extends DivProps {
  title?: string;
}
export const Toolbar = ({ title, children, ...props }: DivProps) => {
  return (
    <div {...props} {...c('', props)}>
      {title && (
        <div {...c('Title')}>
          <Tr>{title}</Tr>
        </div>
      )}
      {children}
    </div>
  );
};
