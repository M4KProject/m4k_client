import { useEffect, useRef } from "preact/hooks";
import { setSelect } from "./bEdit";
import { panel$, screenPos$, screenSize$, zoom$ } from "./flux";
import { useFlux } from "@common/hooks";
import { B } from "./B";
import { Css } from "@common/ui";

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
  const ref = useRef<HTMLDivElement>(null);
  const rootUpdated = useFlux(B.root.update$);
  const rootEl = B.root.el;
  const zoom = useFlux(zoom$);
  const screenSize = useFlux(screenSize$);
  const screenPos = useFlux(screenPos$);
  const panel = useFlux(panel$);

  console.debug('ViewportPan', rootUpdated);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    console.debug('ViewportPan el', el);
    el.appendChild(rootEl);
  }, [ref, rootEl]);

  useEffect(() => {
    const bodySize = document.body.getBoundingClientRect();
    console.debug('bodySize', { bodySize });
    if (!bodySize.width || !bodySize.height) return;

    const sideEl = document.getElementsByClassName('Side')[0];
    const terminalEl = document.getElementsByClassName('EdTerminal')[0];
    const marginWidth = sideEl?.getBoundingClientRect().width || 0;
    const marginHeight = terminalEl?.getBoundingClientRect().height || 0;

    const zoomW = (bodySize.width - marginWidth) / screenSize.w;
    const zoomH = (bodySize.height - marginHeight) / screenSize.h;
    const zoom = (zoomW < zoomH ? zoomW : zoomH) * 0.98;

    console.debug('bodySize', { bodySize, screenSize, zoomW, zoomH, zoom });
    zoom$.set(zoom);

    const panWidth = screenSize.w * zoom;
    const panHeight = screenSize.h * zoom;
    const viewportWidth = bodySize.width - marginWidth;
    const viewportHeight = bodySize.height - marginHeight;
    const x = (viewportWidth - panWidth) / 2;
    const y = (viewportHeight - panHeight) / 2;

    console.debug('bodySize', { panWidth, panHeight, viewportWidth, viewportHeight, x, y });

    screenPos$.set({ x, y });
    setSelect(B.root);
  }, [screenSize, panel, rootUpdated]);

  const style = {
    transform: `scale(${zoom})`,
    width: `${screenSize.w}px`,
    height: `${screenSize.h}px`,
    top: `${screenPos.y}px`,
    left: `${screenPos.x}px`,
    transformOrigin: '0 0',
    };

  return (
    <div {...c()} ref={ref} style={style} />
  );
};
