import { CheckIcon } from 'lucide-react';
import { useInputProps } from '@/components/fields/hooks';
import { Css } from 'fluxio';
import { FIELD_HEIGHT } from '@/components/fields/constants';
import { FieldProps } from '@/components/fields/types';

const c = Css('CheckInput', {
  '': {
    center: 1,
    p: 0,
    mx: 4,
    whMin: FIELD_HEIGHT,
    whMax: FIELD_HEIGHT,
    cursor: 'pointer',
    border: 'border',
    bg: 'bg',
    position: 'relative',
    rounded: 3,
    transition: 0.3,
    boxSizing: 'border-box',
  },
  '-selected': {
    borderColor: 'primary',
    bg: 'primary',
  },
  ' svg': {
    fg: 'handle',
    transition: 0.3,
    scale: 0,
  },
  '-selected svg': {
    scale: 1,
  },
});

const CheckInput = () => {
  const { value, onChange, ...props } = useInputProps();
  return (
    <div onClick={() => onChange(!value)} {...props} {...c('', value && '-selected', props)}>
      <CheckIcon />
    </div>
  );
};

const check: FieldProps<boolean, string> = {
  input: CheckInput,
  delay: 0,
};

export const checkInputs = {
  check,
};
