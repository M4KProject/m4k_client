import { addIn, getLangs, setSelect } from './bEdit';
import { DRoot } from './D';
import B from './B';
import { panel$, screenSize$, terminal$, zoom$ } from './flux';
import { randColor } from 'fluxio';
import { useFlux } from '@common/hooks';
import { Css } from '@common/ui';
import { DivProps, tooltip } from '@common/components';

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
  's': {
    position: 'absolute',
    bottom: 0,
    right: 10,
    m: 1,
    display: 'flex',
    flexDirection: 'row',
    zIndex: 10100,
  },
  'Space': {
    width: 20,
  },
});

function EdFab({ title, name, ...props }: DivProps & { title: string, name: string }) {
  const panel = useFlux(panel$);

  return (
    <div {...tooltip(title)} {...props} class={c('', `-${name}`, panel === name && '-active', props)} />
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
    <div class={c('s')}>
      {/* {getLangs().length > 0 && (
        <EdFab cls="translate" tooltip="Traduire le site" onClick={() => translateAll()}>
          <TranslateIcon />
        </EdFab>
      )} */}
      <EdFab cls="add" tooltip="Ajouter un bloc" onClick={() => addBox()}>
        <AddIcon />
      </EdFab>
      <div class={c('Space')} />
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
      <div class={c('Space')} />
      <EdFab cls="zoom-out" tooltip="Zoom +" onClick={() => zoomAdd(+0.1)}>
        <ZoomInIcon />
      </EdFab>
      <EdFab cls="zoom-in" tooltip="Zoom -" onClick={() => zoomAdd(-0.1)}>
        <ZoomOutIcon />
      </EdFab>
      <div class={c('Space')} />
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
      <div class={c('Space')} />
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
    </div>
  );
}
