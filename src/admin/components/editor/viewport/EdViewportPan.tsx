import { useEffect, useRef } from 'preact/hooks';
import { useFlux } from '@common/hooks';
import { B } from '../B';
import { Css } from 'fluxio';
import { useBEditorController } from '../hooks/useBEditorController';

const c = Css('EdViewportPan', {
  '': {
    position: 'absolute',
    overflow: 'auto',
    xy: 0,
    wh: '100%',
    background: '#FFF',
  },
});

export const EdViewportPan = () => {
  const controller = useBEditorController();
  const { scale, w, h, x, y } = useFlux(controller.viewport$);

  const ref = useRef<HTMLDivElement>(null);
  const rootEl = B.root.el;

  console.debug('EdViewportPan');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    console.debug('ViewportPan el', el);
    el.appendChild(rootEl);
  }, [ref, rootEl]);

  const style = {
    transform: `scale(${scale})`,
    width: `${w}px`,
    height: `${h}px`,
    top: `${y}px`,
    left: `${x}px`,
    transformOrigin: '0 0',
  };

  return <div {...c()} ref={ref} style={style} />;
};
