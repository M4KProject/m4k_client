import { FieldProps, FieldType } from './types';
import { baseInputs } from './inputs/base';
import { multilineInputs } from './inputs/multiline';
import { selectInputs } from './inputs/select';
import { pickerInputs } from './inputs/picker';
import { switchInputs } from './inputs/switch';
import { checkInputs } from './inputs/check';
import { uploadInputs } from './inputs/upload';
import { colorInputs } from './inputs/color';

export const fieldRegistry: Record<FieldType, FieldProps> = {
  ...baseInputs,
  ...multilineInputs,
  ...selectInputs,
  ...pickerInputs,
  ...switchInputs,
  ...checkInputs,
  ...uploadInputs,
  ...colorInputs,
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
