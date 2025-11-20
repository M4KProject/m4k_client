import { Css } from 'fluxio';
import { FieldProps } from '../types';
import { useInputProps } from '../hooks';

const c = Css('UploadInput', {
  '': {},
});

const UploadInput = () => {
  const { value, onChange, ...props } = useInputProps();
  return <div {...props} {...c('', value && '-selected', props)} />;
};

const upload: FieldProps<File[], string> = {
  input: UploadInput,
  delay: 0,
  toRaw: (files) => (files && files[0]?.name) || '',
  // toValue: (raw, e) => (e as InputEvent).files && files[0]?.name || '',
};

export const uploadInputs = {
  upload,
};
