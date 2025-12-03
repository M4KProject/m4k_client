import {
  Css,
  isArray,
  Style,
  StyleFlexAlign,
  StyleFlexJustify,
} from 'fluxio';
import { Field } from '@/components/fields/Field';
import { Button, ButtonProps } from '@/components/common/Button';
import {
  AlignStartHorizontal,
  AlignCenterHorizontal,
  AlignEndHorizontal,
  AlignHorizontalJustifyStart,
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
} from 'lucide-react';
import { Comp } from '@/utils/comp';
import { useBEditController } from './useBEditController';
import { BStyleField, useProp } from './BField';

const c = Css('BSideLayout', {
  '': {
    col: ['stretch', 'start'],
  }
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
  const registryEntries = Object.entries(controller?.registry||{});
  const types = registryEntries.map(
    ([type, config]) => [type, config.label] as [string, Comp]
  );

  return (
    <div {...c('')}>
        <Field name="row">
            <FlexAlignButton icon={AlignStartHorizontal} row start />
            <FlexAlignButton icon={AlignCenterHorizontal} row center />
            <FlexAlignButton icon={AlignEndHorizontal} row end />
            <FlexAlignButton icon={AlignHorizontalJustifyStart} row justify start />
            <FlexAlignButton icon={AlignHorizontalJustifyCenter} row justify center />
            <FlexAlignButton icon={AlignHorizontalJustifyEnd} row justify end />
        </Field>
        <Field name="col">
            <FlexAlignButton icon={AlignStartVertical} start />
            <FlexAlignButton icon={AlignCenterVertical} center />
            <FlexAlignButton icon={AlignEndVertical} end />
            <FlexAlignButton icon={AlignVerticalJustifyStart} justify start />
            <FlexAlignButton icon={AlignVerticalJustifyCenter} justify center />
            <FlexAlignButton icon={AlignVerticalJustifyEnd} justify end />
        </Field>
        <BStyleField label="Fond" prop="bg" type="color" />
    </div>
  );
};