import { Css, isDefined } from 'fluxio';
import { Field } from '@/components/fields/Field';
import { useFlux, useFluxMemo } from '@/hooks/useFlux';
import { BData, BItem, BPropNext } from '@/components/box/bTypes';
import { FieldProps } from '@/components/fields/types';
import { useBEditController } from '../useBEditController';

const c = Css('BField', {
  Sep: {
    w: '100%',
    my: 4,
    h: 1,
    bg: 'border',
  },
});

export const useProp = <K extends keyof BItem>(
  prop: K
): [BItem[K] | undefined, (next: BPropNext<K>) => void] => {
  const controller = useBEditController();
  const i = useFlux(controller.select$)?.i;
  const value = useFluxMemo(() => controller?.prop$(i, prop), [controller, i, prop]);
  return [value, (next: BPropNext<K>) => controller?.setProp(i, prop, next)];
};

export const BField = ({
  prop,
  defaultValue,
  ...props
}: FieldProps<any, any> & { prop: keyof BData; defaultValue?: any }) => {
  const [value, setValue] = useProp(prop);
  return (
    <Field
      name={prop}
      value={isDefined(value) ? value : defaultValue}
      onValue={setValue}
      {...props}
    />
  );
};

export const BFieldSep = () => <div {...c('Sep')} />;
