import { Field } from "@/components/fields/Field";
import { useBEditController } from "../useBEditController";
import { useFlux, useFluxMemo } from "@/hooks/useFlux";
import { Css } from "fluxio";

const c = Css('BDataField', {});

export const BDataField = () => {
  const controller = useBEditController();
  const i = useFlux(controller.select$)?.i;
  const item = useFluxMemo(() => controller.item$(i), [controller, i]);
  const onValue = (next: any) => {
    controller?.set(i, next);
  };
  return <Field {...c('')} label="B" name="box" type="json" value={item} onValue={onValue} col />;
};
