import { onHtmlEvent, SetState, Unsubscribe } from 'fluxio';
import { useMemo, useState } from 'preact/hooks';

const getOnMouseOver = (setOver: SetState<boolean>) => (event: Event) => {
  const target = event instanceof Event && (event.currentTarget || event.target);
  if (!(target instanceof HTMLElement)) return;

  const disposes: Unsubscribe[] = [];

  const end = () => {
    for (const dispose of disposes) dispose();
    disposes.length = 0;

    setOver(false);
  };

  const interval = setInterval(() => !target.isConnected && end(), 500);

  disposes.push(() => clearInterval(interval));
  disposes.push(onHtmlEvent(target, 'mouseleave', end, { once: true }));
  disposes.push(onHtmlEvent(0, 'click', end, { once: true }));

  setOver(true);
};

export const useOver = (): [
  boolean,
  { onMouseOver: (event: Event) => void },
  SetState<boolean>,
] => {
  const [over, setOver] = useState(false);
  const onMouseOver = useMemo(() => getOnMouseOver(setOver), [setOver]);
  return [over, { onMouseOver }, setOver];
};
