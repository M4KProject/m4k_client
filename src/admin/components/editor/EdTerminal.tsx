import { useFlux } from '@common/hooks';
import { EdActions } from './EdActions';
import { EdProps } from './EdProps';
import { EdTree } from './EdTree';
import { panel$, terminal$ } from './flux';
import { EdCode } from './EdCode';
import { Css } from 'fluxio';

const c = Css('EdTerminal', {
  '': {
    flex: 1,
    height: '300px',
    maxHeight: '300px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    borderTop: '1px solid grey',
    zIndex: 10000,
  },
  Switch: {
    position: 'relative',
    flex: 1,
  },
  // '& .EdCode': {
  //   position: 'absolute',
  //   width: '100%',
  //   height: '100%',
  //   overflow: 'hidden',
  // },
});

const EdTerminalSwitch = () => {
  const terminal = useFlux(terminal$);
  console.debug('EdTerminalSwitch', terminal);
  switch (terminal) {
    case 'json':
    case 'html':
    case 'css':
    case 'js':
      return <EdCode />;
    default:
      return <EdProps />;
  }
};

export const EdTerminal = () => {
  const panel = useFlux(panel$);
  if (panel !== 'terminal') return null;
  return (
    <div {...c()}>
      <EdTree />
      <EdActions />
      <div {...c('Switch')}>
        <EdTerminalSwitch />
      </div>
    </div>
  );
};
