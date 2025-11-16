import {
  Css,
  isArray,
  isDefined,
  isUInt,
  Style,
  StyleFlexAlign,
  StyleFlexJustify,
  Writable,
} from 'fluxio';
import { useBCtrl } from '@/box/BCtrl';
import { Field, FieldProps } from '@/components/Field';
import { Tr } from '@/components/Tr';
import { useFlux, useFluxMemo } from '@/hooks/useFlux';
import { BType, BData, BItem, BPropNext, BNext } from '@/box/bTypes';
import { ComponentChildren } from 'preact';
import { isAdvanced$, setIsAdvanced } from '@/router';
import { Button } from '@/components/Button';
import {
  // Texte
  AlignLeft,
  AlignCenter,
  AlignJustify,
  AlignRight,

  // Flex Row
  AlignStartHorizontal,
  AlignCenterHorizontal,
  AlignEndHorizontal,
  AlignHorizontalJustifyStart,
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,

  // Flex Col
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,

  // Add
  ALargeSmall,
  Image,
  SquarePlay,
  BookOpen,
  Square,
} from 'lucide-react';
import { BMedias } from './BMedias';

const c = Css('BProps', {
  '': {
    flex: 2,
    m: 4,
    overflowX: 'hidden',
    overflowY: 'auto',
    col: ['stretch', 'start'],
  },
  ' .FieldLabel': {
    w: 80,
  },
  Row: {
    w: '100%',
    row: ['center', 'around'],
  },
  Sep: {
    my: 4,
    mx: '10%',
    w: '80%',
    h: 2,
    bg: 'g',
  },
});

const useProp = <K extends keyof BItem>(
  prop: K
): [BItem[K] | undefined, (next: BPropNext<K>) => void] => {
  const ctrl = useBCtrl();
  const i = useFlux(ctrl.select$).i;
  const value = useFluxMemo(() => ctrl.prop$(i, prop), [i, prop]);
  return [value, (next: BPropNext<K>) => ctrl.setProp(i, prop, next)];
};

export const BField = ({
  prop,
  defaultValue,
  ...props
}: FieldProps & { prop: keyof BData; defaultValue?: any }) => {
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

const FlexAlign = () => {
  const [style, setStyle] = useProp('s');
  const s = style || ({} as Style);

  const row = isArray(s.row) ? s.row : null;
  const col = isArray(s.col) ? s.col : null;
  const flex = row || col || ['', ''];
  const align = flex[0] as StyleFlexAlign;
  const justify = flex[1] as StyleFlexJustify;

  const btn = (
    icon: ComponentChildren,
    isRow: 1 | 0,
    isJustify: 1 | 0,
    value: StyleFlexAlign & StyleFlexJustify
  ) => {
    const selected = (isRow ? !!row : !!col) && (isJustify ? justify === value : align === value);

    const handleClick = () => {
      setStyle((prev) => {
        const next = { ...prev };
        if (isRow) {
          next.row = isJustify ? [align, value] : [value, justify];
          delete next.col;
        } else {
          delete next.row;
          next.col = isJustify ? [align, value] : [value, justify];
        }
        return next;
      });
    };

    return <Button icon={icon} selected={selected} onClick={handleClick} />;
  };

  return (
    <>
      <Field name="row">
        <div {...c('Row')}>
          {btn(<AlignStartHorizontal />, 1, 0, 'start')}
          {btn(<AlignCenterHorizontal />, 1, 0, 'center')}
          {btn(<AlignEndHorizontal />, 1, 0, 'end')}
          {btn(<AlignHorizontalJustifyStart />, 1, 1, 'start')}
          {btn(<AlignHorizontalJustifyCenter />, 1, 1, 'center')}
          {btn(<AlignHorizontalJustifyEnd />, 1, 1, 'end')}
        </div>
      </Field>
      <Field name="col">
        <div {...c('Row')}>
          {btn(<AlignStartVertical />, 0, 0, 'start')}
          {btn(<AlignCenterVertical />, 0, 0, 'center')}
          {btn(<AlignEndVertical />, 0, 0, 'end')}
          {btn(<AlignVerticalJustifyStart />, 0, 1, 'start')}
          {btn(<AlignVerticalJustifyCenter />, 0, 1, 'center')}
          {btn(<AlignVerticalJustifyEnd />, 0, 1, 'end')}
        </div>
      </Field>
    </>
  );
};

const TextAlign = () => {
  const [style, setStyle] = useProp('s');
  const s = style || ({} as Style);
  const textAlign = s.textAlign as Style['textAlign'];

  const txtBtn = (icon: ComponentChildren, value: Style['textAlign']) => {
    const selected = textAlign === value;

    const handleClick = () => {
      setStyle((prev) => ({ ...prev, textAlign: value }));
    };

    return <Button icon={icon} selected={selected} onClick={handleClick} />;
  };

  return (
    <Field name="textAlign">
      <div {...c('Row')}>
        {txtBtn(<AlignLeft />, 'left')}
        {txtBtn(<AlignCenter />, 'center')}
        {txtBtn(<AlignJustify />, 'justify')}
        {txtBtn(<AlignRight />, 'right')}
      </div>
    </Field>
  );
};

const BStyleField = ({ prop, ...props }: FieldProps & { prop: string }) => {
  const [style, setStyle] = useProp('s');
  const value = ((style || {}) as any)[prop] as any;
  const onValue = (value: any) => {
    setStyle((prev) => ({ ...prev, [prop]: value }));
  };
  return <Field name={prop} value={value} onValue={onValue} {...props} />;
};

export const BDataField = () => {
  const ctrl = useBCtrl();
  const i = useFlux(ctrl.select$).i;
  const item = useFluxMemo(() => ctrl.item$(i), [i]);
  const onValue = (next: any) => {
    ctrl.set(i, next);
  };
  return <Field label="B" name="box" type="json" value={item} onValue={onValue} col />;
};

export const BProps = () => {
  const ctrl = useBCtrl();
  const select = useFlux(ctrl.select$);
  const isAdvanced = useFlux(isAdvanced$);
  const i = select.i;
  const item = select.item;
  const types = Object.entries(ctrl.registry).map(
    ([type, config]) => [type, <Tr>{config.label}</Tr>] as [string, ComponentChildren]
  );
  const [nType] = useProp('t');
  const type = nType || 'box';
  const config = ctrl.registry[type] || ({} as Partial<BType>);

  if (!isUInt(i) || !item) return null;

  return (
    <div {...c()}>
      <div {...c('Sep')} />
      <BField label="Nom" prop="n" />
      <BStyleField label="Fond" prop="bg" type="color" />
      {config.a && <FlexAlign />}

      {config.b && (
        <>
          <div {...c('Sep')} />
          <Field label="Texte">
            <BStyleField prop="fontSize" type="number" />
            <BStyleField prop="fg" type="color" />
          </Field>
          <BField prop="b" type="multiline" col />
          <TextAlign />
        </>
      )}

      {/* <Field label="Bordure" Comp={() => (
        <>
          <BStyleField prop="borderColor" type="color" />
          <BStyleField prop="borderWidth" type="number" />
        </>
      )} /> */}

      {config.r && (
        <Field label="Ajouter">
          <div {...c('Row')}>
            {Object.entries(ctrl.registry).map(([t, config]) => {
              const Icon = config?.icon || Square;
              if (t === 'root' || t === 'rect') return null;
              return (
                <Button
                  icon={<Icon />}
                  tooltip={config?.label || ''}
                  onClick={() => {
                    const next: Writable<Partial<BItem>> = { p: i, t };
                    if (type === 'text') next.b = 'Mon texte !';
                    ctrl.add(next);
                  }}
                />
              );
            })}
          </div>
        </Field>
      )}
      <div {...c('Sep')} />
      <Field
        type="switch"
        label="Avancé"
        name="advanced"
        value={isAdvanced}
        onValue={setIsAdvanced}
      />
      {isAdvanced && (
        <>
          <BField label="Type" prop="t" type="select" defaultValue="box" items={types} />
          <Field label="Contour">
            <BStyleField prop="border" type="number" />
            <BStyleField prop="rounded" type="number" />
            <BStyleField prop="borderColor" type="color" />
          </Field>
          <BStyleField label="Marge" prop="p" type="number" />
          <BStyleField label="Cacher" prop="hide" type="switch" />
          <BField label="Classe" prop="c" />
          <BField label="Media ID" prop="m" />
          <BField label="Init" prop="init" type="json" col />
          <BField label="Click" prop="click" type="json" col />
          <BDataField />
        </>
      )}
      {config.m && <BMedias />}
    </div>
  );
};

// import { Css } from 'fluxio';

// const c = Css('BButtons', {
//   '': {
//     col: 1,
//   },
// });

// export const BButtons = () => {
//   return (
//     <div {...c()}>
//       TREE
//     </div>
//   );
// };
