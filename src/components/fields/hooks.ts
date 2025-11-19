import { useContext, useEffect, useState } from "preact/hooks";
import { FieldContext, FieldController } from "./FieldController";
import { isEmpty } from "fluxio";

export const useFieldController = () => useContext(FieldContext)!;

export const useFieldRaw = <V, R>(ctrl: FieldController<V, R>) => {
  const [v, set] = useState(ctrl.state.raw);
  useEffect(() => ctrl.subscribe(s => set(s.raw)), [ctrl]);
  return v;
};

export const useFieldValue = <V, R>(ctrl: FieldController<V, R>) => {
  const [v, set] = useState(ctrl.state.value);
  useEffect(() => ctrl.subscribe(s => set(s.value)), [ctrl]);
  return v;
};

export const useFieldError = <V, R>(ctrl: FieldController<V, R>) => {
  const [v, set] = useState(ctrl.state.error);
  useEffect(() => ctrl.subscribe(s => set(s.error)), [ctrl]);
  return v;
};

export const useFieldConfig = <V, R>(ctrl: FieldController<V, R>) => {
  const [v, set] = useState(ctrl.state.config);
  useEffect(() => ctrl.subscribe(s => set(s.config)), [ctrl]);
  return v;
};

interface inputProps {
  value: any;
  onChange: (e: any) => void;
  name: string | undefined;
  required: boolean | undefined;
  placeholder?: string;
  class?: any;
}

export const useInputProps = () => {
  const ctrl = useFieldController();

  const raw = useFieldRaw(ctrl);
  const config = useFieldConfig(ctrl);

  const { props: inputProps, name, required, placeholder } = config;

  const props: inputProps = {
    value: raw,
    onChange: (e) => ctrl.onChange(e),
    name,
    required,
  };

  if (!isEmpty(inputProps)) Object.assign(props, inputProps);
  if (placeholder) props.placeholder = placeholder;

  return props;
};