import { Css, isArray, Style, StyleFlexAlign, StyleFlexJustify } from 'fluxio';
import { Field } from '@/components/fields/Field';
import { Button, ButtonProps } from '@/components/common/Button';
import {
  AlignStartHorizontalIcon,
  AlignCenterHorizontalIcon,
  AlignEndHorizontalIcon,
  AlignHorizontalJustifyStartIcon,
  AlignHorizontalJustifyCenterIcon,
  AlignHorizontalJustifyEndIcon,
  AlignStartVerticalIcon,
  AlignCenterVerticalIcon,
  AlignEndVerticalIcon,
  AlignVerticalJustifyStartIcon,
  AlignVerticalJustifyCenterIcon,
  AlignVerticalJustifyEndIcon,
} from 'lucide-react';
import { Comp } from '@/utils/comp';
import { useBEditController } from '../useBEditController';
import { BStyleField, useProp } from '../BField';

const c = Css('BSideLayout', {
  '': {
    col: ['stretch', 'start'],
  },
});

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

export const BSideLayout = () => {
  const controller = useBEditController();
  const registryEntries = Object.entries(controller.registry || {});
  const types = registryEntries.map(([type, config]) => [type, config.label] as [string, Comp]);

  return (
    <div {...c('')}>
      <Field name="row">
        <FlexAlignButton icon={AlignStartHorizontalIcon} row start />
        <FlexAlignButton icon={AlignCenterHorizontalIcon} row center />
        <FlexAlignButton icon={AlignEndHorizontalIcon} row end />
        <FlexAlignButton icon={AlignHorizontalJustifyStartIcon} row justify start />
        <FlexAlignButton icon={AlignHorizontalJustifyCenterIcon} row justify center />
        <FlexAlignButton icon={AlignHorizontalJustifyEndIcon} row justify end />
      </Field>
      <Field name="col">
        <FlexAlignButton icon={AlignStartVerticalIcon} start />
        <FlexAlignButton icon={AlignCenterVerticalIcon} center />
        <FlexAlignButton icon={AlignEndVerticalIcon} end />
        <FlexAlignButton icon={AlignVerticalJustifyStartIcon} justify start />
        <FlexAlignButton icon={AlignVerticalJustifyCenterIcon} justify center />
        <FlexAlignButton icon={AlignVerticalJustifyEndIcon} justify end />
      </Field>
      <BStyleField label="Fond" prop="bg" type="color" />
    </div>
  );
};
