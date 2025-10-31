import Box from '@mui/material/Box';
import { editorCtrl } from '../../controllers/EditorController';
import { useFlux } from 'vegi';
import Lazy from '../Lazy';
import EdActions from './EdActions';
import EdProps from './EdProps';
import EdTree from './EdTree';

function EdTerminalSwitch() {
  const terminal = useFlux(editorCtrl.terminal$);
  console.debug('EdTerminalSwitch', terminal);
  switch (terminal) {
    case 'json':
    case 'html':
    case 'css':
    case 'js':
      return <Lazy factory={() => import('./EdCode')} />;
    default:
      return <EdProps />;
  }
}

export default function EdTerminal() {
  const panel = useFlux(editorCtrl.panel$);
  if (panel !== 'terminal') return null;
  return (
    <Box
      className="EdTerminal"
      sx={{
        flex: 1,
        height: '300px',
        maxHeight: '300px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        borderTop: '1px solid grey',
        zIndex: 10000,
        '& .EdTerminalSwitch': {
          position: 'relative',
          flex: 1,
          '& .EdCode': {
            position: 'absolute',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          },
        },
      }}
    >
      <EdTree />
      <EdActions />
      <div className="EdTerminalSwitch">
        <EdTerminalSwitch />
      </div>
    </Box>
  );
}
