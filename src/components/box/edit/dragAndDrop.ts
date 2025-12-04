import { getEventXY } from 'fluxio';

export const bDrag = (type: string) => {
  return {
    style: { cursor: 'grab' },
    onMouseUp: (e: Event) => console.debug('draggable onMouseUp', type, getEventXY(e)),
    onmousedown: (e: Event) => console.debug('draggable onmousedown', type, getEventXY(e)),
  };
};
