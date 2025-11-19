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
import { Field } from '@/components/Field';
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
  Square,
} from 'lucide-react';
import { BMedias } from './BMedias';
import { FieldProps } from '@/components/fields/types';

const c = Css('BProps', {
  '': {
    flex: 2,
    m: 4,
    overflowX: 'hidden',
    overflowY: 'auto',
    col: ['stretch', 'start'],
  },
  '> *': {
    flexShrink: 0,
  },
  ' .FieldLabel': {
    w: 80,
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

const FlexAlignButton = ({
  icon,
  row,
  justify,
  v,
}: {
  icon: ComponentChildren;
  row?: true;
  justify?: true;
  v: StyleFlexJustify & StyleFlexAlign;
}) => {
  const [style, setStyle] = useProp('s');
  const s = style || ({} as Style);

  const fRow = isArray(s.row) ? s.row : null;
  const fCol = isArray(s.col) ? s.col : null;
  const flex = fRow || fCol || ['', ''];
  const fAlign = flex[0] as StyleFlexAlign;
  const fJustify = flex[1] as StyleFlexJustify;

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

const TextAlignButton = ({ icon, v }: { icon: ComponentChildren; v: Style['textAlign'] }) => {
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

const BStyleField = ({ prop, ...props }: FieldProps<any, any> & { prop: string }) => {
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
    <div {...c()} key={i}>
      <div {...c('Sep')} />
      <BField label="Nom" prop="n" />
      <BStyleField label="Fond" prop="bg" type="color" />
      <BStyleField label="Texte" prop="fg" type="color" />
      <BStyleField label="Font Size" prop="fontSize" type="number" />

      {config.a && (
        <>
          <Field name="row">
            <FlexAlignButton icon={<AlignStartHorizontal />} row v="start" />
            <FlexAlignButton icon={<AlignCenterHorizontal />} row v="center" />
            <FlexAlignButton icon={<AlignEndHorizontal />} row v="end" />
            <FlexAlignButton icon={<AlignHorizontalJustifyStart />} row justify v="start" />
            <FlexAlignButton icon={<AlignHorizontalJustifyCenter />} row justify v="center" />
            <FlexAlignButton icon={<AlignHorizontalJustifyEnd />} row justify v="end" />
          </Field>
          <Field name="col">
            <FlexAlignButton icon={<AlignStartVertical />} v="start" />
            <FlexAlignButton icon={<AlignCenterVertical />} v="center" />
            <FlexAlignButton icon={<AlignEndVertical />} v="end" />
            <FlexAlignButton icon={<AlignVerticalJustifyStart />} justify v="start" />
            <FlexAlignButton icon={<AlignVerticalJustifyCenter />} justify v="center" />
            <FlexAlignButton icon={<AlignVerticalJustifyEnd />} justify v="end" />
          </Field>
        </>
      )}

      {config.b && (
        <>
          <div {...c('Sep')} />
          <BField prop="b" type="multiline" col />
          <Field name="textAlign">
            <TextAlignButton icon={<AlignLeft />} v="left" />
            <TextAlignButton icon={<AlignCenter />} v="center" />
            <TextAlignButton icon={<AlignJustify />} v="justify" />
            <TextAlignButton icon={<AlignRight />} v="right" />
          </Field>
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
          {Object.entries(ctrl.registry).map(([t, config], i) => {
            const Icon = config?.icon || Square;
            if (t === 'root' || t === 'rect') return null;
            return (
              <Button
                key={i}
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
