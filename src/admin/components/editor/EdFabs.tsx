import { addIn, setSelect } from './bEdit';
import { DRoot } from './D';
import B from './B';
import { panel$, screenSize$, terminal$, zoom$ } from './flux';
import { randColor } from 'fluxio';
import { useFlux } from '@common/hooks';
import { Css } from '@common/ui';
import { DivProps, tooltip } from '@common/components';
import {
  FilePlus,
  RotateCwIcon,
  Eye,
  Tablet,
  Smartphone,
  ZoomIn,
  ZoomOut,
  Fullscreen,
  Terminal,
  Sidebar,
  Save,
  Backpack,
} from 'lucide-react';

function setPanel(name: string) {
  terminal$.set('');
  panel$.set(name);
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
    backgroundColor: randColor(),
  });
  setSelect(b);
}

const c = Css('EdFab', {
  '': {
    m: 0.5,
    width: '100%',
    height: '100%',
  },
  s: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    m: 1,
    display: 'flex',
    flexDirection: 'row',
    zIndex: 10100,
  },
  Space: {
    width: 20,
  },
});

function EdFab({ title, name, ...props }: DivProps & { title: string; name?: string }) {
  const panel = useFlux(panel$);

  return (
    <div
      {...tooltip(title)}
      {...props}
      {...c('', `-${name}`, panel === name && '-active', props)}
    />
  );
}

export const EdFabs = () => {
  const panel = useFlux(panel$);
  useFlux(B.root.update$);
  const dEditor = (B.root.d as DRoot).editor;

  const zoomAdd = (add: number) => {
    zoom$.set(zoom$.get() + add);
  };

  const setScreen = (w: number, h: number) => {
    screenSize$.set({ w, h });
  };

  const screenRotation = () => {
    const { w, h } = screenSize$.get();
    setScreen(h, w);
  };

  return (
    <div {...c('s')}>
      {/* {getLangs().length > 0 && (
        <EdFab cls="translate" tooltip="Traduire le site" onClick={() => translateAll()}>
          <TranslateIcon />
        </EdFab>
      )} */}
      <EdFab {...c('Add')} title="Ajouter un bloc" onClick={() => addBox()}>
        <FilePlus />
      </EdFab>
      <div {...c('Space')} />
      {!dEditor?.screen && (
        <>
          <EdFab {...c('Rotation')} title="Tourner l'écran" onClick={() => screenRotation()}>
            <RotateCwIcon />
          </EdFab>
          <EdFab {...c('Tv')} title="Affichage TV" onClick={() => setScreen(1920, 1080)}>
            <Eye />
          </EdFab>
          <EdFab {...c('Tablet')} title="Affichage tablet" onClick={() => setScreen(820, 1180)}>
            <Tablet />
          </EdFab>
          <EdFab
            {...c('Smartphone')}
            title="Affichage Smartphone"
            onClick={() => setScreen(390, 844)}
          >
            <Smartphone />
          </EdFab>
        </>
      )}
      <div {...c('Space')} />
      <EdFab {...c('ZoomOut')} title="Zoom +" onClick={() => zoomAdd(+0.1)}>
        <ZoomIn />
      </EdFab>
      <EdFab {...c('ZoomIn')} title="Zoom -" onClick={() => zoomAdd(-0.1)}>
        <ZoomOut />
      </EdFab>
      <div {...c('Space')} />
      <EdFab {...c('FullScreen')} title="Affichage en plein écran" onClick={() => setPanel('')}>
        <Fullscreen />
      </EdFab>
      <EdFab
        {...c('Side')}
        title="Affichage du terminal"
        onClick={() => {
          if (panel === 'side') {
            setPanel('terminal');
          } else {
            setPanel('side');
          }
        }}
      >
        {panel === 'side' ?
          <Terminal />
        : <Sidebar />}
      </EdFab>
      <div {...c('Space')} />
      <EdFab
        {...c('Save')}
        title="Enregistrer les modifications"
        onClick={() => {
          // editorCtrl.saveSite();
        }}
      >
        <Save />
      </EdFab>
      <EdFab
        {...c('Back')}
        title="Annuler les modifications"
        onClick={() => {
          // router.push(`/admin`);
        }}
      >
        <Backpack />
      </EdFab>
    </div>
  );
};
