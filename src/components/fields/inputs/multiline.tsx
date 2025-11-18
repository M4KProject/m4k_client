import { useInputProps } from "../hooks";
import { FieldProps } from "../types";

const Multiline = () => <textarea rows={5} {...useInputProps()} />;

const multiline: FieldProps = {
  input: Multiline,
  delay: 1000,
}

const json: FieldProps = {
  input: Multiline,
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

export const multilineInputs = {
  multiline,
  json,
}