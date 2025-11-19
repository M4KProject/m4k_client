import { useState } from "preact/hooks";
import { useInputProps } from "../hooks";
import { FieldProps } from "../types";
import { Button } from "@/components/Button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { formatSeconds, parseSeconds, toError, toNumber, toString } from "fluxio";

const getInput = <V=string>(type: string): FieldProps<V, string> => ({
    input: () => <input type={type} {...useInputProps()} />,
    delay: 400,
});

const email = getInput('email');
const text = getInput('text');
const number = getInput<number>('text');
const date = getInput('date');

number.toRaw = toString;
number.toValue = toNumber;

const password: FieldProps<string, string> = {
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

const seconds: FieldProps<number, string> = {
    input: () => <input type="text" placeholder="00:00:00" {...useInputProps()} />,
    delay: 400,
    toValue: (next) => next ? parseSeconds(next) : undefined,
    toRaw: (value) => value ? formatSeconds(value) : undefined,
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