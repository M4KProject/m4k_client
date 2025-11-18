import { useInputProps } from "../FieldCtrl";
import { FieldProps } from "../types";

export const jsonInput: FieldProps = {
  input: () => <textarea rows={5} {...useInputProps()} />,
  convert: (value: any) => {
    if (typeof value !== 'string') return value;
    const trimmed = value.trim();
    if (!trimmed) return value; // Garde la string vide ou whitespace
    return JSON.parse(value);
  },
  reverse: (value: any) => {
    if (typeof value === 'string') return value;
    return JSON.stringify(value, undefined, 2);
  },
  delay: 1000,
}