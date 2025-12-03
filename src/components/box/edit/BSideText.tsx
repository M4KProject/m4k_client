import { Css, Style } from 'fluxio';
import { Field } from '@/components/fields/Field';
import { Button } from '@/components/common/Button';
import { Comp } from '@/utils/comp';
import { useBEditController } from './useBEditController';
import { BField, BStyleField, useProp } from './BField';
import { AlignCenterIcon, AlignJustifyIcon, AlignLeftIcon, AlignRightIcon, PlusIcon } from 'lucide-react';

const c = Css('BSideText', {
  '': {
    col: ['stretch', 'start'],
  }
});

export const TextAlignButton = ({ icon, v }: { icon: Comp; v: Style['textAlign'] }) => {
  const [style, setStyle] = useProp('s');
  const s = style || ({} as Style);

  return (
    <Button
      icon={icon}
      selected={s.textAlign === v}
      onClick={() => {
        setStyle((prev) => ({ ...prev, textAlign: v }));
      }}
    />
  );
};

export const BSideText = () => {
  const controller = useBEditController();
  const registryEntries = Object.entries(controller?.registry||{});
  const types = registryEntries.map(
    ([type, config]) => [type, config.label] as [string, Comp]
  );

  return (
    <div {...c('')}>
      <Button color="primary" icon={PlusIcon} title="Ajouter" />
      <BStyleField label="Couleur" prop="fg" type="color" />
      <BStyleField label="Fond" prop="bg" type="color" />
      <BStyleField label="Taille" prop="fontSize" type="number" />
      <Field name="textAlign">
        <TextAlignButton icon={AlignLeftIcon} v="left" />
        <TextAlignButton icon={AlignCenterIcon} v="center" />
        <TextAlignButton icon={AlignJustifyIcon} v="justify" />
        <TextAlignButton icon={AlignRightIcon} v="right" />
      </Field>
      <BField prop="b" type="multiline" col />
    </div>
  );
};