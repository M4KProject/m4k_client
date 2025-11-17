import { useState } from 'preact/hooks';
import { Button } from '@/components/Button';
import { FieldType } from './types';
import { CheckIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { Select } from './Select';
import { Picker } from './Picker';
import { fieldStyle } from './fieldStyle';
import { useFieldContext, useInputProps } from './FieldCtrl';

const c = fieldStyle;

const getMediaInput = (_mimetypes: string[]) => () => {
  const props = useInputProps();
  return <input type="text" {...props} />;
};

export const ImageInput = getMediaInput([
  'image/png',
  'image/jpeg',
  'image/svg+xml',
  'application/pdf',
]);
export const DocInput = getMediaInput(['application/pdf']);

export const getTextInput = (type: string) => () => <input type={type} {...useInputProps()} />;

export const EmailInput = getTextInput('email');
export const ColorInput = getTextInput('color');
export const TextInput = getTextInput('text');
export const NumberInput = getTextInput('number');
export const DateInput = getTextInput('date');

export const PasswordInput = () => {
  const [show, setShow] = useState(false);
  const props = useInputProps();
  return (
    <>
      <input type={show ? 'text' : 'password'} {...props} />
      <Button
        onClick={(e) => {
          e.preventDefault();
          setShow((s) => !s);
        }}
        icon={show ? <EyeOffIcon /> : <EyeIcon />}
      />
    </>
  );
};

export const SecondsInput = () => <input type="text" placeholder="00:00:00" {...useInputProps()} />;

export const MultilineInput = () => <textarea rows={5} {...useInputProps()} />;

export const JsonInput = () => <textarea rows={5} {...useInputProps()} />;

export const SwitchInput = () => {
  const { value, onChange, ...props } = useInputProps();
  return (
    <div
      onClick={() => onChange(!value)}
      {...props}
      {...c('Input', value && 'Input-selected', props)}
    >
      <div {...c('InputHandle')}></div>
    </div>
  );
};

export const CheckInput = () => {
  const { value, onChange, ...props } = useInputProps();
  return (
    <div
      onClick={() => onChange(!value)}
      {...props}
      {...c('Input', value && 'Input-selected', props)}
    >
      <CheckIcon />
    </div>
  );
};

export const SelectInput = () => {
  const ctx = useFieldContext();
  const { value, onChange, name, required, placeholder } = useInputProps();
  return (
    <Select
      items={ctx.config.items}
      value={value}
      onChange={onChange}
      name={name}
      required={required}
      placeholder={placeholder}
    />
  );
};

export const PickerInput = () => {
  const ctx = useFieldContext();
  const { value, onChange, name, required } = useInputProps();
  return (
    <Picker
      items={ctx.config.items}
      value={value}
      onChange={onChange}
      name={name}
      required={required}
    />
  );
};

export const defaultInputConfig = { input: TextInput, delay: 400 };

export type InputConfig = typeof defaultInputConfig;

export const fieldRegistry: Record<FieldType, Partial<InputConfig>> = {
  text: {},
  email: { input: EmailInput },
  password: { input: PasswordInput },
  color: { input: ColorInput },
  multiline: { input: MultilineInput },
  json: { input: JsonInput },
  number: { input: NumberInput },
  date: { input: DateInput },
  datetime: { input: DateInput },
  seconds: { input: SecondsInput },
  select: { input: SelectInput, delay: 0 },
  picker: { input: PickerInput, delay: 0 },
  switch: { input: SwitchInput, delay: 0 },
  check: { input: CheckInput, delay: 0 },
  image: { input: ImageInput, delay: 0 },
  doc: { input: DocInput, delay: 0 },
};

// export const castByType: Dictionary<(next: any) => any> = {
//   json: (next: any) => {
//     const casted = jsonParse(next);
//     if (casted === null) throw toError('not-a-json');
//     return casted;
//   },
//   number: (next: any) => {
//     const casted = toNumber(next, null);
//     if (casted === null) throw toError('not-a-number');
//     return casted;
//   },
//   seconds: (next: any) => {
//     const seconds = parseSeconds(next);
//     if (seconds === null) throw toError('invalid-time-format');
//     return seconds;
//   },
// };

// export const formatByType: Dictionary<(value: any) => any> = {
//   json: (value: any) => {
//     if (typeof value === 'string') return value;
//     return jsonStringify(value, undefined, 2);
//   },
//   seconds: (value: any) => {
//     if (typeof value === 'number') return formatSeconds(value);
//     return value || '';
//   },
// };
