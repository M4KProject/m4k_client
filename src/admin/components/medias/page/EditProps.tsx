import { Css, CssStyle, Dictionary, firstUpper, isArray, isDefined, isString, NextState, pascalCase, SetState, Style, StyleFlexAlign, StyleFlexJustify, toArray } from 'fluxio';
import { BoxConfig, useBoxCtrl } from './box/BoxCtrl';
import { Field, FieldProps } from '@/components/Field';
import { Tr } from '@/components/Tr';
import { useFlux, useFluxMemo } from '@/hooks/useFlux';
import { BoxData } from './box/boxTypes';
import { ComponentChildren } from 'preact';
import { isAdvanced$ } from '@/router';
import { Button, ButtonProps } from '@/components/Button';
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
} from 'lucide-react';

const c = Css('EditProps', {
  '': {
    flex: 2,
    col: 1,
    elevation: 1,
    m: 4,
  },
  ' .FieldLabel': {
    w: 100,
  },
  AlignRow: {
    w: '100%',
    row: ['center', 'between'],
  }
});

const useProp = <K extends keyof BoxData>(
  prop: K
): [BoxData[K] | undefined, SetState<BoxData[K]>] => {
  const ctrl = useBoxCtrl();
  const id = useFlux(ctrl.click$).id;
  const value = useFluxMemo(() => ctrl.getProp$(id, prop), [id, prop]);
  return [value, (next: NextState<BoxData[K]>) => ctrl.setProp(id, prop, next)];
};


export const EditProp = ({ prop, defaultValue, ...props }: FieldProps & { prop: keyof BoxData, defaultValue?: any }) => {
  const [value, setValue] = useProp(prop);
  return <Field name={prop} value={isDefined(value) ? value : defaultValue} onValue={setValue} {...props} />;
};

const Align = () => {
  const [style, setStyle] = useProp('style');
  const s = style || {} as Style;

  const row = isArray(s.row) ? s.row : null;
  const col = isArray(s.col) ? s.col : null;
  const flex = row || col || ['', ''];
  const align = flex[0] as StyleFlexAlign;
  const justify = flex[1] as StyleFlexJustify;

  const textAlign = s.textAlign as Style['textAlign'];

  const btn = (icon: ComponentChildren, isRow: 1|0, isJustify: 1|0, value: StyleFlexAlign&StyleFlexJustify) => {
    const selected = (isRow ? !!row : !!col) && (isJustify ? justify === value : align === value);

    const handleClick = () => {
      setStyle(prev => {
        const next = {...prev};
        if (isRow) {
          next.row = isJustify ? [align, value] : [value, justify];
          delete next.col;
        }
        else {
          delete next.row;
          next.col = isJustify ? [align, value] : [value, justify];
        }
        return next;
      });
    }
    
    return (
      <Button icon={icon} selected={selected} onClick={handleClick} />
    )
  };

  const txtBtn = (icon: ComponentChildren, value: Style['textAlign']) => {
    const selected = textAlign === value;

    const handleClick = () => {
      setStyle(prev => ({ ...prev, textAlign: value }));
    }
    
    return (
      <Button icon={icon} selected={selected} onClick={handleClick} />
    )
  };

  return (
    <>
      <Field name="row" Comp={() => (
        <div {...c('AlignRow')}>
          {btn(<AlignStartHorizontal />, 1, 0, 'start')}
          {btn(<AlignCenterHorizontal />, 1, 0, 'center')}
          {btn(<AlignEndHorizontal />, 1, 0, 'end')}
          {btn(<AlignHorizontalJustifyStart />, 1, 1, 'start')}
          {btn(<AlignHorizontalJustifyCenter />, 1, 1, 'center')}
          {btn(<AlignHorizontalJustifyEnd />, 1, 1, 'end')}
        </div>
      )} />
      <Field name="col" Comp={() => (
        <div {...c('AlignRow')}>
          {btn(<AlignStartVertical />, 0, 0, 'start')}
          {btn(<AlignCenterVertical />, 0, 0, 'center')}
          {btn(<AlignEndVertical />, 0, 0, 'end')}
          {btn(<AlignVerticalJustifyStart />, 0, 1, 'start')}
          {btn(<AlignVerticalJustifyCenter />, 0, 1, 'center')}
          {btn(<AlignVerticalJustifyEnd />, 0, 1, 'end')}
        </div>
      )} />
      <Field name="textAlign" Comp={() => (
        <div {...c('AlignRow')}>
          {txtBtn(<AlignLeft />, 'left')}
          {txtBtn(<AlignCenter />, 'center')}
          {txtBtn(<AlignJustify />, 'justify')}
          {txtBtn(<AlignRight />, 'right')}
        </div>
      )} />
    </>
  )
};

export const EditStyleProp = ({ prop, ...props }: FieldProps & { prop: string }) => {
  const [style, setStyle] = useProp('style');
  const value = ((style || {}) as any)[prop] as any;
  const onValue = (value: any) => {
    setStyle(prev => ({ ...prev, [prop]: value }));
  }
  return <Field name={prop} value={value} onValue={onValue} {...props} />;
};

export const BoxProp = () => {
  const ctrl = useBoxCtrl();
  const id = useFlux(ctrl.click$).id;
  const value = useFluxMemo(() => ctrl.get$(id), [id]);
  const onValue = (value: any) => {
    ctrl.set(id, value);
  }
  return <Field label="Box" name="box" type="json" value={value} onValue={onValue} col />;
};

export const EditProps = () => {
  const ctrl = useBoxCtrl();
  const select = useFlux(ctrl.click$);
  const isAdvanced = useFlux(isAdvanced$);
  const id = select.id;
  const box = select.box;
  const types = Object.entries(ctrl.registry).map(
    ([type, config]) => [type, <Tr>{config.label}</Tr>] as [string, ComponentChildren]
  );
  const [nType] = useProp('type');
  const type = nType || 'box';
  const config = ctrl.registry[type] || {} as Partial<BoxConfig>;

  if (!id || !box) return null;

  return (
    <div {...c()}>
      <EditProp label="Nom" prop="name" />
      <EditProp label="Cacher" prop="hide" type="switch" />
      <EditProp label="Type" prop="type" type="select" defaultValue="box" items={types} />
      <EditProp label="Classe" prop="cls" />
      <Align />
      
      {config.text && (
        <>
          <EditProp label="Texte" prop="text" type="multiline" />
        </>
      )}
      <Field label="Couleur" Comp={() => (
        <>
          <EditStyleProp prop="bg" type="color" />
          <EditStyleProp prop="fg" type="color" />
        </>
      )} />
      <EditProp label="Media" prop="mediaId" />
      {/* <Field label="Bordure" Comp={() => (
        <>
          <EditStyleProp prop="borderColor" type="color" />
          <EditStyleProp prop="borderWidth" type="number" />
        </>
      )} /> */}

      {config.children && <Button>Ajouter un texte</Button>}
      {isAdvanced && (
        <>
          {/* <EditProp label="Position" prop="pos" type="json" col /> */}
          
          <EditProp label="Style" prop="style" type="json" col />
          <EditProp label="Click" prop="onClick" type="json" col />
          <EditProp label="Init" prop="onInit" type="json" col />
          <EditProp label="Data" prop="data" type="json" col />
          <BoxProp />
        </>
      )}
    </div>
  );
};

// import { Css } from 'fluxio';

// const c = Css('EditButtons', {
//   '': {
//     col: 1,
//   },
// });

// export const EditButtons = () => {
//   return (
//     <div {...c()}>
//       TREE
//     </div>
//   );
// };
