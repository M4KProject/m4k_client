import { useState } from 'preact/hooks';
import { Button } from '@/components/Button';
import { FieldInput, FieldInputProps, FieldType } from './types';
import { CheckIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { Select } from './Select';
import { Picker } from './Picker';
import { fieldStyle } from './fieldStyle';

const c = fieldStyle;

const getMediaField = (_mimetypes: string[]): FieldInput => {
  // const mimetypeMap = by(mimetypes, m => m, () => true);
  return ({ cls, name, required, value, onChange, fieldProps }) => {
    // const medias = Object.values(useFlux(medias$));
    // const filteredMedias = medias.filter(m => mimetypeMap[m.mimetype]);
    // const groupId = useFlux(groupId$);
    return (
      <select
        name={name}
        required={required}
        value={value || ''}
        onChange={onChange}
        {...fieldProps.props}
        {...c(cls, fieldProps.props)}
      >
        {/* <option value="" className={!value ? `${cls}Selected` : undefined}></option>
                {Object.values(filteredMedias).map(media => (
                    <option key={media.id} value={media.id} className={media.id === value ? `${cls}Selected` : undefined}>
                        {media.name.replace(`${groupId}/`, '')}
                    </option>
                ))} */}
      </select>
    );
  };
};

const getInputProps = (props: FieldInputProps) => {
  const { cls, name, required, value, onChange, fieldProps } = props;
  return {
    name,
    required,
    value: value || '',
    onChange,
    ...fieldProps.props,
    ...c(cls, fieldProps.props),
  };
}

export const EmailInput: FieldInput = (props) => (
  <input {...getInputProps(props)} type="email" />
);

export const PasswordInput: FieldInput = (props) => {
  const [show, setShow] = useState(false);
  return (
    <>
      <input {...getInputProps(props)} type={show ? 'text' : 'password'} />
      <Button
        onClick={(e) => {
          e.preventDefault();
          setShow((s) => !s);
        }}
        icon={show ? <EyeOffIcon /> : <EyeIcon />}
      />
    </>
  );
};

export const ColorInput: FieldInput = (props) => (
  <input {...getInputProps(props)} type="color" />
);

export const TextInput: FieldInput = (props) => (
  <input {...getInputProps(props)} type="text" />
);

export const NumberInput: FieldInput = (props) => (
  <input {...getInputProps(props)} type="number" />
);

export const DateInput: FieldInput = (props) => (
  <input {...getInputProps(props)} type="date" />
);

export const SecondsInput: FieldInput = (props) => (
  <input {...getInputProps(props)} type="text" placeholder="00:00:00" />
);

export const MultilineInput: FieldInput = (props) => (
  <textarea {...getInputProps(props)} rows={5} />
);

export const JsonInput: FieldInput = (props) => (
  <textarea {...getInputProps(props)} rows={5} />
);

export const SwitchInput: FieldInput = (props) => {
  const { cls, value, onChange, fieldProps } = props;
  return (
    <div
      onClick={() => onChange(!value)}
      {...fieldProps.props}
      {...c(cls, value && `${cls}-selected`, fieldProps.props)}
    >
      <div {...c(`${cls}Handle`)}></div>
    </div>
  );
};

export const CheckInput: FieldInput = (props) => {
  const { cls, value, onChange, fieldProps } = props;
  return (
    <div
      onClick={() => onChange(!value)}
      {...fieldProps.props}
      {...c(cls, value && `${cls}-selected`, fieldProps.props)}
    >
      <CheckIcon />
    </div>
  );
};

export const SelectInput: FieldInput = (props) => {
  const { fieldProps, ...rest } = props;
  return (
    <Select {...rest} items={fieldProps.items} {...fieldProps.props} />
  );
};

export const PickerInput: FieldInput = (props) => {
  const { fieldProps, ...rest } = props;
  return (
    <Picker {...rest} items={fieldProps.items} {...fieldProps.props} />
  );
};

export const fieldRegistry: Record<FieldType, FieldInput> = {
  email: EmailInput,
  password: PasswordInput,
  color: ColorInput,
  text: TextInput,
  multiline: MultilineInput,
  json: JsonInput,
  number: NumberInput,
  select: SelectInput,
  picker: PickerInput,
  switch: SwitchInput,
  check: CheckInput,
  image: getMediaField(['image/png', 'image/jpeg', 'image/svg+xml', 'application/pdf']),
  doc: getMediaField(['application/pdf']),
  date: DateInput,
  datetime: DateInput,
  seconds: SecondsInput,
};
