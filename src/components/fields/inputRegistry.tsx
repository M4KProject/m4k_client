import { FieldProps, FieldType } from './types';
import { baseInputs } from './inputs/base';
import { multilineInputs } from './inputs/multiline';
import { selectInputs } from './inputs/select';
import { pickerInputs } from './inputs/picker';
import { switchInputs } from './inputs/switch';
import { checkInputs } from './inputs/check';
import { uploadInputs } from './inputs/upload';
import { colorInputs } from './inputs/color';

export const inputRegistry: Record<FieldType, FieldProps<any, any>> = {
  ...baseInputs,
  ...multilineInputs,
  ...selectInputs,
  ...pickerInputs,
  ...switchInputs,
  ...checkInputs,
  ...uploadInputs,
  ...colorInputs,
};
