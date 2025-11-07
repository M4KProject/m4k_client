import { useFlux } from '../hooks/useFlux';
import { Css } from 'fluxio';
import { ComponentChildren } from 'preact';
import { Flux } from 'fluxio';
import { DivProps } from './types';
import { Tr } from './Tr';
import { portal } from './Portal';
import { useEffect, useState } from 'preact/hooks';

export const showDialog = (
  title: string,
  getContent: (open$: Flux<boolean>) => ComponentChildren,
  props?: Partial<DialogRenderProps>
) => {
  console.debug('showDialog', title);

  const open$ = new Flux(false);

  const dispose = portal(
    <DialogRender open$={open$} title={title} {...props}>
      <Tr>{getContent(open$)}</Tr>
    </DialogRender>
  );

  open$.on((v) => !v && setTimeout(dispose, 500));
};

const c = Css('Dialog', {
  '': {
    position: 'fixed',
    inset: 0,
    bg: 'mask',
    center: 1,
    opacity: 0,
    transition: 0.5,
  },
  Window: {
    col: 1,
    elevation: 3,
    rounded: 7,
    wMin: 40,
    bg: 'b0',
    fg: 't2',
    scale: 0,
    transition: 0.5,
    p: 4,
  },
  Header: {
    center: 1,
    m: 4,
  },
  HeaderText: {
    fg: 't3',
    bold: 1,
    fontSize: 2,
  },
  Content: {
    col: 'center',
    m: 4,
  },

  '-open': {
    opacity: 1,
  },
  '-open &Window': {
    scale: 1,
  },
  '-error &Header': {
    fg: 'error',
  },
});

interface DialogRenderProps extends DivProps {
  open$: Flux<boolean>;
  variant?: 'error';
}
const DialogRender = ({ open$, variant, title, children, ...props }: DialogRenderProps) => {
  const open = useFlux(open$);
  const [init, setInit] = useState(false);
  const [canClose, setCanClose] = useState(false);

  const onClose = () => {
    if (canClose) {
      open$.set(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      open$.set(true);
    }, 10);
  }, []);

  useEffect(() => {
    if (open) {
      setInit(true);
      setTimeout(() => {
        setCanClose(true);
      }, 2000);
    }
  }, [open]);

  return (
    <div {...c('', open && '-open', variant && `-${variant}`)} onClick={onClose} {...props}>
      <div {...c('Window')} onClick={(e) => e.stopPropagation()}>
        {title && (
          <div {...c('Header')}>
            <div {...c('HeaderText')}>
              <Tr>{title}</Tr>
            </div>
          </div>
        )}
        <div {...c('Content')}>{init ? children : null}</div>
      </div>
    </div>
  );
};
