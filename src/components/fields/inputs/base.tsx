import { useState } from 'preact/hooks';
import { useInputProps } from '@/components/fields/hooks';
import { FieldProps } from '@/components/fields/types';
import { Button } from '@/components/common/Button';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { formatSeconds, parseSeconds, toNumber, toString } from 'fluxio';

const getInput = <V = string,>(type: string): FieldProps<V, string> => ({
  input: () => {
    const props = useInputProps();
    return <input {...props} type={type} />;
  },
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
        <input {...props} type={show ? 'text' : 'password'} />
        <Button
          onClick={(e) => {
            e.preventDefault();
            setShow((s) => !s);
          }}
          icon={show ? <EyeOffIcon /> : <EyeIcon />}
        />
      </>
    );
  },
};

const seconds: FieldProps<number, string> = {
  input: () => {
    const props = useInputProps();
    return <input {...props} type="text" placeholder={props.placeholder || '00:00:00'} />;
  },
  toValue: parseSeconds,
  toRaw: formatSeconds,
};

export const baseInputs = {
  text: text,
  email: email,
  password: password,
  number: number,
  date: date,
  datetime: date,
  seconds: seconds,
};
