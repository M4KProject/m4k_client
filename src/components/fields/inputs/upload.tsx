import { Css } from "fluxio";
import { FieldProps } from "../types";
import { useInputProps } from "../hooks";

const c = Css('UploadInput', {
  '': {
  },
});

const UploadInput = () => {
  const { value, onChange, ...props } = useInputProps();
  return (
    <div
      {...props}
      {...c('', value && '-selected', props)}
    />
  );
};

const upload: FieldProps = {
  input: UploadInput,
  delay: 0,
};

export const uploadInputs = {
  upload,
}