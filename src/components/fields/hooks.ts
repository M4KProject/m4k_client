import { useContext } from "preact/hooks";
import { FieldContext } from "./FieldController";
import { useFlux } from "@/hooks/useFlux";

export const useFieldContext = () => useContext(FieldContext)!;

export const useInputProps = (): any => {
  const ctx = useContext(FieldContext)!;
  const value = useFlux(ctx.input$);
  const { onChange, onBlur, config } = ctx;
  const { props: inputProps, name, required, placeholder } = config;
  const props: any = { value, onChange, onBlur, name, required, ...inputProps };
  if (placeholder) props.placeholder = placeholder;
  return props;
};