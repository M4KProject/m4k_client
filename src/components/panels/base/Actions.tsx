import { DivProps } from '@/components/common/types';
import { Css } from 'fluxio';

const c = Css('Actions', {
  '': {
    rowWrap: 1,
    w: '100%',
    bg: 'bg',
    elevation: 1,
    rounded: 5,
  },
  ' .Button, .Field': {
    m: 4,
    wMax: 350,
  },
  Sep: {
    flex: 1,
  },
  ' .FieldLabel': {
    wMax: 150,
  },
});

export interface ActionsProps extends DivProps {

}

export const ActionsSep = (props: DivProps) => {
  return (
    <div {...props} {...c('Sep', props)} />
  );
};

export const Actions = ({ children, ...props }: ActionsProps) => {
  return (
    <div {...props} {...c('', props)}>
        {children}
    </div>
  );
};