import { useInputProps } from '@/components/fields/hooks';
import { Css } from 'fluxio';
import { FIELD_HEIGHT } from '@/components/fields/constants';

const HANDLE_SIZE = FIELD_HEIGHT - 6;
const HANDLE_X = HANDLE_SIZE - 4;

const c = Css('SwitchInput', {
  '': {
    center: 1,
    w: 50,
    h: FIELD_HEIGHT,
    cursor: 'pointer',
    border: 'border',
    bg: 'bg',
    position: 'relative',
    rounded: 99,
    transition: 0.3,
  },
  '-selected': { borderColor: 'primary', bg: 'primary' },

  Handle: {
    wh: HANDLE_SIZE,
    m: -1,
    mr: 0,
    mb: 0,
    bg: 'handle',
    rounded: 99,
    position: 'absolute',
    elevation: 1,
    transition: 0.3,
    translateX: -HANDLE_X + 'px',
  },
  '-selected &Handle': { translateX: HANDLE_X + 'px' },
});

const SwitchInput = () => {
  const { value, onChange, ...props } = useInputProps();

  return (
    <div onClick={() => onChange(!value)} {...props} {...c('', value && '-selected', props)}>
      <div {...c('Handle')}></div>
    </div>
  );
};

export const switchInputs = {
  switch: {
    input: SwitchInput,
    delay: 0,
  },
};
