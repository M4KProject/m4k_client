import { useState } from 'preact/hooks';
import { useInputProps } from '../hooks';
import { FieldProps } from '../types';
import { Button } from '@/components/Button';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { formatSeconds, parseSeconds, toNumber, toString } from 'fluxio';

const getInput = <V = string,>(type: string): FieldProps<V, string> => ({
  input: () => {
    const props = useInputProps();
    console.debug('input render', type, props);
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
    console.debug('password render', props, show);
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
    console.debug('seconds render', props);
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
