import { Css, isDefined, isNotEmpty } from 'fluxio';
import { DivProps } from '@/components/common/types';
import { Tr } from '@/components/common/Tr';
import { FieldProps } from './types';
import { FieldController, FieldProvider } from './FieldController';
import { FIELD_HEIGHT, LABEL_WIDTH } from './constants';
import { Button } from '@/components/common/Button';
import { XIcon } from 'lucide-react';
import { useFieldController, useFieldState } from './hooks';
import { useConstant } from '@/hooks/useConstant';
import { tooltipProps } from '../common/Tooltip';

export const c = Css('Field', {
  '': {
    row: 'center',
    w: '100%',
    hMin: 30,
  },
  Group: {
    row: ['center', 'between'],
  },
  '-col': {
    col: ['stretch', 'start'],
  },
  '-error &Label': {
    fg: 'error',
  },
  '-error input': {
    border: 'error',
  },
  Error: {
    fg: 'error',
  },
  Label: {
    // flex: 1,
    textAlign: 'left',
    opacity: 0.6,
    fg: 'txt',
    w: LABEL_WIDTH,
  },
  Content: {
    w: '100%',
    row: ['center', 'around'],
    flex: 2,
    hMin: 16,
  },
  'Content > .Field:not(:first-child)': {
    ml: 4,
  },
  Clear: {
    m: 0,
    ml: 2,
  },
  ' input,& textarea': {
    w: '100%',
    hMin: FIELD_HEIGHT,
    py: 2,
    px: 8,
    border: 'border',
    rounded: 5,
    outline: 'none',
    bg: 'bg',
    fg: 'txt',
    fontSize: '100%',
    fontFamily: 'mono',
    // elevation: 1,
  },
  ' input:hover,& textarea:hover': {
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

const ClearButton = () => {
  const ctrl = useFieldController();
  const { config, value } = useFieldState(ctrl, 'config', 'value');

  const { clearable, readonly } = config;
  const showClear = clearable && isDefined(value) && !readonly;
  return showClear ?
      <Button
        {...c('Clear')}
        icon={<XIcon size={16} />}
        onClick={() => ctrl.update({ value: undefined })}
        tooltip="Effacer la valeur"
      />
    : null;
};

export const Field = <V = any, R = any>(props: FieldProps<V, R>) => {
  const ctrl = useConstant(() => new FieldController<V, R>());
  ctrl.setProps(props);

  const { config, error } = useFieldState(ctrl, 'config', 'error');

  const { input: Input, children, label, helper, col, type, tooltip, containerProps } = config;

  const isComposed = isNotEmpty(children);

  return (
    <FieldProvider value={ctrl}>
      <div
        {...containerProps}
        {...c('', col && '-col', type && `-${type}`, error && '-error', containerProps)}
      >
        {label && (
          <div {...c('Label')} {...tooltipProps(tooltip)}>
            {label} :
          </div>
        )}
        <div {...c('Content')}>
          {isComposed ?
            children
          : Input ?
            <Input />
          : null}
          <ClearButton />
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
