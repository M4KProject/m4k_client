import { isDefined, isString } from "fluxio";
import { useInputProps } from "../hooks";
import { FieldProps } from "../types";

const Multiline = () => <textarea rows={5} {...useInputProps()} />;

const multiline: FieldProps<string, string>  = {
  input: Multiline,
  delay: 1000,
}

const json: FieldProps<any, string>  = {
  input: Multiline,
  toRaw: (value: any) => {
    console.debug('json toRaw', value);
    try {
      return isDefined(value) ? JSON.stringify(value, undefined, 2) : undefined;
    }
    catch (error) {
      console.error('json toRaw error', value, error);
      throw error;
    }
  },
  toValue: (value: any) => {
    console.debug('json toValue', value);
    try {
      return isString(value) ? JSON.parse(value) : undefined;
    }
    catch (error) {
      console.error('json toValue error', value, error);
      throw error;
    }
  },
  delay: 1000,
}

export const multilineInputs = {
  multiline,
  json,
}