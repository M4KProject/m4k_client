import { FieldProps, FieldType } from './types';
import { CheckIcon } from 'lucide-react';
import { Select } from './Select';
import { Picker } from './Picker';
import { fieldStyle } from './fieldStyle';
import { useFieldContext, useInputProps } from './FieldCtrl';
import { jsonInput } from './inputs/jsonInput';
import { 
  emailInput ,
  colorInput,
  textInput,
  numberInput,
  dateInput,
  passwordInput,
  secondsInput,
} from './inputs/textInput';

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

export const MultilineInput = () => <textarea rows={5} {...useInputProps()} />;

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

export const fieldRegistry: Record<FieldType, FieldProps> = {
  text: textInput,
  email: emailInput,
  password: passwordInput,
  color: colorInput,
  multiline: { input: MultilineInput },
  json: jsonInput,
  number: numberInput,
  date: dateInput,
  datetime: dateInput,
  seconds: secondsInput,
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
