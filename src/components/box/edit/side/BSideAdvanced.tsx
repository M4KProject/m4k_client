import { Css } from 'fluxio';
import { useBEditController } from '../useBEditController';
import { Comp } from '@/utils/comp';
import { BDataField, BField, BStyleField } from '../BField';
import { Field } from '@/components/fields/Field';

const c = Css('BSideAdvanced', {
});

export const BSideAdvanced = () => {
  const controller = useBEditController()!;
  const registryEntries = Object.entries(controller.registry || {});
  const types = registryEntries.map(([type, config]) => [type, config.label] as [string, Comp]);

  return (
    <div {...c('')}>
      <BStyleField label="Cacher" prop="hide" type="switch" />
      <BField label="Type" prop="t" type="select" defaultValue="box" items={types} />
      <Field label="Contour">
        <BStyleField prop="border" type="number" />
        <BStyleField prop="rounded" type="number" />
        <BStyleField prop="borderColor" type="color" />
      </Field>
      <BStyleField label="Marge" prop="p" type="number" />
      <BField label="Classe" prop="c" />
      <BField label="Media ID" prop="m" />
      <BField label="Init" prop="init" type="json" col />
      <BField label="Click" prop="click" type="json" col />
      <BDataField />
    </div>
  );
};
