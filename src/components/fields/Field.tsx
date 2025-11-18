import { Css, isNotEmpty } from 'fluxio';
import { useEffect, useMemo } from 'preact/hooks';
import { DivProps } from '@/components/types';
import { Tr } from '@/components/Tr';
import { useFlux } from '@/hooks/useFlux';
import { FieldProps, FieldComponent } from './types';
import { FieldController, FieldProvider } from './FieldController';
import { FIELD_HEIGHT, LABEL_WIDTH } from './constants';

export const c = Css('Field', {
  '': {
    row: 'center',
    my: 4,
    w: '100%',
    hMin: FIELD_HEIGHT,
  },
  Group: {
    row: ['center', 'between'],
  },
  '-col': {
    col: ['stretch', 'start'],
  },
  '-error &Label': { fg: 'error' },
  '-error input': { border: 'error' },
  Error: { fg: 'error' },
  Label: {
    // flex: 1,
    textAlign: 'left',
    opacity: 0.6,
    fg: 't',
    w: LABEL_WIDTH,
  },
  Content: {
    row: ['center', 'start'],
    flex: 2,
    hMin: 16,
  },
  'Content > .Field:not(:first-child)': {
    ml: 4,
  },
  ' input': {
    w: '100%',
    hMin: FIELD_HEIGHT,
    py: 2,
    px: 8,
    border: 'border',
    rounded: 5,
    outline: 'none',
    bg: 'bg',
    fg: 't',
    fontSize: '1rem',
    // elevation: 1,
  },
  ' input:hover': {
    borderColor: 'border',
  },

  // // Régle la couleur de l'autocompletion
  // 'Input:autofill': {
  //   '-webkit-text-fill-color': 'black',
  //   '-webkit-box-shadow': '0 0 0 1000px white inset',
  //   caretColor: 'black',
  // },

  // // Styles pour les flèches de l'input number (Chrome/Safari/Edge)
  // 'Input::-webkit-inner-spin-button': {
  //   opacity: 1,
  //   backgroundColor: 'white',
  //   color: 'black',
  //   cursor: 'pointer',
  // },
  // 'Input::-webkit-outer-spin-button': {
  //   opacity: 1,
  //   backgroundColor: 'white',
  //   color: 'black',
  //   cursor: 'pointer',
  // },
});

export const Field: FieldComponent = (props: FieldProps) => {
  const ctx = useMemo(() => new FieldController(), []);
  useEffect(() => {
    () => ctx.dispose();
  }, [ctx]);

  ctx.setProps(props);

  const config = ctx.config;
  const { input: Input, children, label, helper, col, type, containerProps } = config;

  const error = useFlux(ctx.error$);

  const isComposed = isNotEmpty(children);

  return (
    <FieldProvider value={ctx}>
      <div
        {...containerProps}
        {...c('', col && '-col', type && `-${type}`, error && '-error', containerProps)}
      >
        {label && <div {...c('Label')}>{label} :</div>}
        <div {...c('Content')}>
          {isComposed ?
            children
          : Input ?
            <Input />
          : null}
          {error ?
            <div {...c('Error')}>
              <Tr>{error}</Tr>
            </div>
          : helper ?
            <div {...c('Helper')}>{helper}</div>
          : null}
        </div>
      </div>
    </FieldProvider>
  );
};

export const FieldGroup = (props: DivProps) => <div {...props} {...c('Group', props)} />;
