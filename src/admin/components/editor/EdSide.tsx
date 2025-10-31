import Box from '@mui/material/Box';
import { editorCtrl } from '../../controllers/EditorController';
import { useMsg } from 'vegi';
// import Lazy from "../Lazy";
import EdActions from './EdActions';
// import Code from "./EdCode";
import EdProps from './EdProps';
import EdTree from './EdTree';

// function TerminalSwitch({ name }: { name: string }) {
//     const curr = useMsg(editorCtrl.panel$);
//     if (curr !== name) return null;
//     switch(name) {
//         case 'props':
//             return <EdProps />;
//       case 'json':
//       case 'html':
//       case 'css':
//       case 'js':
//         // return <Lazy factory={() => import('./Code')} />;
//         return <Code />;
//       default:
//         return <div />
//     }
// }

export default function Side() {
  const panel = useMsg(editorCtrl.panel$);
  if (panel !== 'side') return null;
  return (
    <Box
      className="Side"
      sx={{
        background: '#FFF',
        width: '350px',
        maxWidth: '350px',
        height: '100%',
        maxHeight: '100%',
        position: 'absolute',
        right: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        borderTop: '1px solid grey',
        zIndex: 10000,
        '& .Props': {
          p: 0.5,
          // alignItems: 'stretch',
          // flexDirection: 'column',
        },
        '& .Prop .PLabel': {
          width: 95,
          fontSize: '72%',
          justifyContent: 'flex-start',
        },
        '& .Prop .PRemove svg': {
          width: '0.8em',
          height: '0.8em',
        },
        '& .Action .ActionRow': {
          display: 'none',
        },
        '& .Action .ActionRow-primary': {
          display: 'flex',
        },
      }}
    >
      <EdTree />
      <EdActions />
      <EdProps />
    </Box>
  );
}
