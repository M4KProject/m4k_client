import { Css, isArray, Style, StyleFlexAlign, StyleFlexJustify } from 'fluxio';
import { Field } from '@/components/fields/Field';
import { Button, ButtonProps } from '@/components/common/Button';
import { Comp } from '@/utils/comp';
import { useBEditController } from '../useBEditController';
import { BField, BStyleField, useProp } from '../BField';
import {
  AlignCenterHorizontal,
  AlignCenterIcon,
  AlignEndHorizontal,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  AlignStartHorizontal,
  PlusIcon,
} from 'lucide-react';

const c = Css('BSideText', {});

const FlexAlignButton = ({
  icon,
  row,
  justify,
  start,
  end,
}: {
  icon: ButtonProps['icon'];
  row?: true;
  justify?: true;
  start?: true;
  center?: true;
  end?: true;
}) => {
  const [style, setStyle] = useProp('s');
  const s = style || ({} as Style);

  const fRow = isArray(s.row) ? s.row : null;
  const fCol = isArray(s.col) ? s.col : null;
  const flex = fRow || fCol || ['', ''];
  const fAlign = flex[0] as StyleFlexAlign;
  const fJustify = flex[1] as StyleFlexJustify;

  const v =
    start ? 'start'
    : end ? 'end'
    : 'center';

  const selected = (row ? !!fRow : !!fCol) && (justify ? fJustify === v : fAlign === v);

  const handleClick = () => {
    setStyle((prev) => {
      const next = { ...prev };
      if (row) {
        next.row = justify ? [fAlign, v] : [v, fJustify];
        delete next.col;
      } else {
        delete next.row;
        next.col = justify ? [fAlign, v] : [v, fJustify];
      }
      return next;
    });
  };

  return <Button icon={icon} selected={selected} onClick={handleClick} />;
};

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
  const registryEntries = Object.entries(controller.registry || {});
  const types = registryEntries.map(([type, config]) => [type, config.label] as [string, Comp]);

  return (
    <div {...c('')}>
      <Button color="primary" icon={PlusIcon} title="Ajouter" />
      <BStyleField label="Fond" prop="bg" type="color" />
      <BStyleField label="Couleur" prop="fg" type="color" />
      <BStyleField label="Image" prop="fg" type="color" />
      <BStyleField label="Taille" prop="fontSize" type="number" />
      <Field>
        <FlexAlignButton icon={AlignStartHorizontal} row start />
        <FlexAlignButton icon={AlignCenterHorizontal} row center />
        <FlexAlignButton icon={AlignEndHorizontal} row end />
      </Field>
      <Field>
        <TextAlignButton icon={AlignLeftIcon} v="left" />
        <TextAlignButton icon={AlignCenterIcon} v="center" />
        <TextAlignButton icon={AlignJustifyIcon} v="justify" />
        <TextAlignButton icon={AlignRightIcon} v="right" />
      </Field>
      <BField prop="b" type="multiline" col />
    </div>
  );
};
