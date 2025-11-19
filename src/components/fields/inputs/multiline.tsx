import { isDefined, isString } from "fluxio";
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
    console.debug('Multiline json convert', value);
    try {
      return isDefined(value) ? JSON.parse(value) : undefined;
    }
    catch (error) {
      console.error('Multiline json convert', value, error);
      try {
        return isDefined(value) ? JSON.stringify(value, undefined, 2) : undefined;
      }
      catch (error) {
        console.error('Multiline json convert2', value, error);
        throw error;
      }
    }
  },
  reverse: (value: any) => {
    console.debug('Multiline json reverse', value);
    try {
      return isDefined(value) ? JSON.stringify(value, undefined, 2) : undefined;
    }
    catch (error) {
      console.error('Multiline json reverse', value, error);
      try {
        return isDefined(value) ? JSON.parse(value) : undefined;
      }
      catch (error) {
        console.error('Multiline json reverse2', value, error);
        throw error;
      }
    }
  },
  delay: 1000,
}

export const multilineInputs = {
  multiline,
  json,
}