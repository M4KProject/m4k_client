import { useState } from "preact/hooks";
import { useInputProps } from "../hooks";
import { FieldProps } from "../types";
import { Button } from "@/components/Button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { formatSeconds, parseSeconds, toError, toNumber } from "fluxio";

const getInput = (type: string): FieldProps => ({
    input: () => <input type={type} {...useInputProps()} />,
    delay: 400,
});

const email = getInput('email');
const text = getInput('text');
const number = getInput('text');
const date = getInput('date');

number.convert = (value: any) => {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (!trimmed) return value; // Garde la string vide
  const num = toNumber(trimmed, null);
  if (num === null) throw new Error('invalid-number');
  return num;
};

number.reverse = (value: any) => {
  if (typeof value === 'string') return value;
  return String(value);
};

const password: FieldProps = {
    input: () => {
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
    }
};

const seconds: FieldProps = {
    input: () => <input type="text" placeholder="00:00:00" {...useInputProps()} />,
    delay: 400,
    convert: (next: any) => {
        const seconds = parseSeconds(next);
        if (seconds === null) throw toError('invalid-time-format');
        return seconds;
    },
    reverse: (value: any) => {
        if (typeof value === 'number') return formatSeconds(value);
        return value || '';
    }
}

export const baseInputs = {
  text: text,
  email: email,
  password: password,
  number: number,
  date: date,
  datetime: date,
  seconds: seconds,
}