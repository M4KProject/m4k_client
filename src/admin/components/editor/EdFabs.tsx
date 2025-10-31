import Fab, { FabProps } from '@mui/material/Fab';

import TranslateIcon from '@mui/icons-material/TranslateTwoTone';
import AddIcon from '@mui/icons-material/AddBoxTwoTone';
import ScreenRotationIcon from '@mui/icons-material/ScreenRotationTwoTone';
import TvIcon from '@mui/icons-material/TvTwoTone';
import SmartphoneIcon from '@mui/icons-material/SmartphoneTwoTone';
import TabletMacIcon from '@mui/icons-material/TabletMacTwoTone';
import ZoomInIcon from '@mui/icons-material/ZoomInTwoTone';
import ZoomOutIcon from '@mui/icons-material/ZoomOutTwoTone';
import TerminalIcon from '@mui/icons-material/Terminal';
import SideIcon from '@mui/icons-material/ViewSidebar';
import SaveIcon from '@mui/icons-material/SaveTwoTone';
import BackIcon from '@mui/icons-material/ArrowBackTwoTone';
import FullscreenIcon from '@mui/icons-material/Fullscreen';

import Box from '@mui/material/Box';
import { editorCtrl } from '../../controllers/EditorController';
import { useFlux } from 'vegi';
import { addIn, getLangs, setSelect } from './bEdit';
import { DRoot } from './D';
import tinycolor2 from 'tinycolor2';
import app from '../../../app';
import clsx from 'clsx';
import router from '../../../helpers/router';
import Tooltip from '../Tooltip';
import B from './B';
import { translateAll } from '../../../api/translate';

app.tinycolor2 = tinycolor2;

function setPanel(name: string) {
  editorCtrl.terminal$.set('');
  editorCtrl.panel$.set(name);
}

function addBox() {
  console.debug('addBox');
  const b = addIn(B.root);
  if (!b) return;
  b.updateStyle({
    position: 'absolute',
    left: 10 + Math.round(Math.random() * 20) + '%',
    top: 10 + Math.round(Math.random() * 20) + '%',
    width: 20 + Math.round(Math.random() * 20) + '%',
    height: 20 + Math.round(Math.random() * 20) + '%',
    backgroundColor:
      '#' +
      app
        .tinycolor2({
          h: 240 * Math.random(),
          s: 0.25 + 0.5 * Math.random(),
          l: 0.25 + 0.5 * Math.random(),
        })
        .toHex(),
  });
  setSelect(b);
}

function EdFab({ cls, tooltip, ...props }: FabProps & { cls: string; tooltip: string }) {
  const panel = useFlux(editorCtrl.panel$);
  const getCls = (name: string) => clsx('EdFab EdFab-' + name, panel === name && 'EdFab-active');

  return (
    <Tooltip title={tooltip}>
      <Fab size="small" className={getCls(cls)} {...props} />
    </Tooltip>
  );
}

export default function EdFabs() {
  const panel = useFlux(editorCtrl.panel$);
  useFlux(B.root.update$);
  const dEditor = (B.root.d as DRoot).editor;

  const zoomAdd = (add: number) => {
    editorCtrl.zoom$.set(editorCtrl.zoom$.val + add);
  };

  const setScreen = (w: number, h: number) => {
    editorCtrl.screenSize$.set({ w, h });
  };

  const screenRotation = () => {
    const { w, h } = editorCtrl.screenSize$.val;
    setScreen(h, w);
  };

  return (
    <Box
      className="EdFabs"
      sx={{
        position: 'absolute',
        bottom: 0,
        right: 10,
        m: 1,
        display: 'flex',
        flexDirection: 'row',
        zIndex: 10100,
        '& .EdFab': {
          m: 0.5,
        },
        '& .EdFab-active': {
          // color: 'white',
          // backgroundColor: '#7b1fa2',
        },
        '& .EdSpace': {
          width: 20,
        },
      }}
    >
      {getLangs().length > 0 && (
        <EdFab cls="translate" tooltip="Traduire le site" onClick={() => translateAll()}>
          <TranslateIcon />
        </EdFab>
      )}
      <EdFab cls="add" tooltip="Ajouter un bloc" onClick={() => addBox()}>
        <AddIcon />
      </EdFab>
      <div className="EdSpace" />
      {!dEditor?.screen && (
        <>
          <EdFab cls="rotation" tooltip="Tourner l'écran" onClick={() => screenRotation()}>
            <ScreenRotationIcon />
          </EdFab>
          <EdFab cls="tv" tooltip="Affichage TV" onClick={() => setScreen(1920, 1080)}>
            <TvIcon />
          </EdFab>
          <EdFab cls="tablet" tooltip="Affichage tablet" onClick={() => setScreen(820, 1180)}>
            <TabletMacIcon />
          </EdFab>
          <EdFab cls="smartphone" tooltip="Affichage Smartphone" onClick={() => setScreen(390, 844)}>
            <SmartphoneIcon />
          </EdFab>
        </>
      )}
      <div className="EdSpace" />
      <EdFab cls="zoom-out" tooltip="Zoom +" onClick={() => zoomAdd(+0.1)}>
        <ZoomInIcon />
      </EdFab>
      <EdFab cls="zoom-in" tooltip="Zoom -" onClick={() => zoomAdd(-0.1)}>
        <ZoomOutIcon />
      </EdFab>
      <div className="EdSpace" />
      <EdFab cls="fullscreen" tooltip="Affichage en plein écran" color="secondary" onClick={() => setPanel('')}>
        <FullscreenIcon />
      </EdFab>
      <EdFab
        cls="side"
        tooltip="Affichage du terminal"
        color="secondary"
        onClick={() => {
          if (panel === 'side') {
            setPanel('terminal');
          } else {
            setPanel('side');
          }
        }}
      >
        {panel === 'side' ? <TerminalIcon /> : <SideIcon />}
      </EdFab>
      <div className="EdSpace" />
      <EdFab
        cls="save"
        tooltip="Enregistrer les modifications"
        color="primary"
        onClick={() => {
          editorCtrl.saveSite();
        }}
      >
        <SaveIcon />
      </EdFab>
      <EdFab
        cls="back"
        tooltip="Annuler les modifications"
        color="error"
        onClick={() => {
          router.push(`/admin`);
        }}
      >
        <BackIcon />
      </EdFab>
    </Box>
  );
}
