import { useState } from "preact/hooks";
import { useInputProps } from "../FieldCtrl";
import { FieldProps } from "../types";
import { Button } from "@/components/Button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { toNumber } from "fluxio";

const getInput = (type: string): FieldProps => ({
    input: () => <input type={type} {...useInputProps()} />,
    delay: 400,
});

export const emailInput = getInput('email');
export const colorInput = getInput('color');
export const textInput = getInput('text');
export const numberInput = getInput('number');
export const dateInput = getInput('date');

numberInput.convert = (value: any) => {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (!trimmed) return value; // Garde la string vide
  const num = toNumber(trimmed, null);
  if (num === null) throw new Error('invalid-number');
  return num;
};

numberInput.reverse = (value: any) => {
  if (typeof value === 'string') return value;
  return String(value);
};

export const passwordInput = {
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

export const secondsInput = {
    input: () => <input type="text" placeholder="00:00:00" {...useInputProps()} />,
    delay: 400,
}