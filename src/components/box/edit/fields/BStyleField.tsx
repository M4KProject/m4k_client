import { Field } from "@/components/fields/Field";
import { Css } from "fluxio";
import { useProp } from "./BField";
import { FieldProps } from "@/components/fields/types";

const c = Css('BStyleField', {});

export const BStyleField = ({ prop, ...props }: FieldProps<any, any> & { prop: string }) => {
  const [style, setStyle] = useProp('s');
  const value = ((style || {}) as any)[prop] as any;
  const onValue = (value: any) => {
    setStyle((prev) => ({ ...prev, [prop]: value }));
  };
  return <Field {...c('')} name={prop} value={value} onValue={onValue} {...props} />;
};
