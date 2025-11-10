import { Css, CssStyle, Dictionary, firstUpper, NextState, pascalCase, SetState } from 'fluxio';
import { BoxConfig, useBoxCtrl } from './box/BoxCtrl';
import { Field, FieldProps } from '@/components/Field';
import { Tr } from '@/components/Tr';
import { useFlux, useFluxMemo } from '@/hooks/useFlux';
import { BoxData } from './box/boxTypes';
import { ComponentChildren } from 'preact';
import { isAdvanced$ } from '@/router';
import { Button } from '@/components/Button';

const c = Css('EditProps', {
  '': {
    flex: 2,
    col: 1,
    elevation: 1,
    m: 4,
  },
  ' .FieldLabel': {
    w: 110,
  },
});

const useProp = <K extends keyof BoxData>(
  prop: K
): [BoxData[K] | undefined, SetState<BoxData[K]>] => {
  const ctrl = useBoxCtrl();
  const id = useFlux(ctrl.click$).id;
  const value = useFluxMemo(() => ctrl.getProp$(id, prop), [id, prop]);
  return [value, (next: NextState<BoxData[K]>) => ctrl.setProp(id, prop, next)];
};


export const EditProp = ({ prop, ...props }: FieldProps & { prop: keyof BoxData }) => {
  const [value, setValue] = useProp(prop);
  return <Field name={prop} value={value} onValue={setValue} {...props} />;
};

export const AlignProp = (props: FieldProps) => {
  const [value, setValue] = useProp('style');
  return <Field name="align" {...props} Comp={() => (
    <>
      <Button>Center</Button>
    </>
  )} />;
};

export const EditStyleProp = ({ prop, ...props }: FieldProps & { prop: string }) => {
  const [style, setStyle] = useProp('style');
  const value = ((style || {}) as any)[prop] as any;
  const onValue = (value: any) => {
    setStyle(prev => ({ ...prev, [prop]: value }));
  }
  return <Field name={prop} value={value} onValue={onValue} {...props} />;
};

export const EditProps = () => {
  const ctrl = useBoxCtrl();
  const select = useFlux(ctrl.click$);
  const isAdvanced = useFlux(isAdvanced$);
  const id = select.id;
  const box = select.box;
  const types = Object.keys(ctrl.registry).map(
    (type) => [type, <Tr>{type}</Tr>] as [string, ComponentChildren]
  );
  const [type] = useProp('type') || 'box';
  const config = type && ctrl.registry[type] || {} as Partial<BoxConfig>;

  if (!id || !box) return null;

  return (
    <div {...c()}>
      <EditProp label="Nom" prop="name" />
      <AlignProp label="Alignement" />
      <EditProp label="Type" prop="type" type="select" items={types} />
      <EditProp label="Cacher" prop="hide" type="switch" />
      <EditProp label="Media" prop="mediaId" />
      <EditStyleProp label="Couleur" prop="bg" type="color" />
      <EditStyleProp label="Style Texte" prop="fg" type="color" />
      <EditStyleProp label="Bordure" prop="border" type="color" />
      {config.text && <EditProp label="Texte" prop="text" type="multiline" />}
      {config.children && <Button>Ajouter un texte</Button>}
      {isAdvanced && (
        <>
          <EditProp label="Position" prop="pos" type="json" col />
          <EditProp label="Style" prop="style" type="json" col />
          <EditProp label="Click" prop="onClick" type="json" col />
          <EditProp label="Init" prop="onInit" type="json" col />
          <EditProp label="Data" prop="data" type="json" col />
          <EditProp label="Class" prop="cls" />
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
