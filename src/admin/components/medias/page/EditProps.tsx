import { Css, Dictionary, firstUpper, NextState, pascalCase, SetState } from 'fluxio';
import { useBoxCtrl } from './box/BoxCtrl';
import { Field, FieldProps } from '@/components/Field';
import { Tr } from '@/components/Tr';
import { useFlux, useFluxMemo } from '@/hooks/useFlux';
import { BoxData } from './box/boxTypes';
import { ComponentChildren } from 'preact';
import { isAdvanced$ } from '@/router';

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
});

const useProp = <K extends keyof BoxData>(
  prop: K
): [BoxData[K] | undefined, SetState<BoxData[K]>] => {
  const ctrl = useBoxCtrl();
  const id = useFlux(ctrl.click$).id;
  const value = useFluxMemo(() => ctrl.getProp$(id, prop), [id, prop]);
  return [value, (next: NextState<BoxData[K]>) => ctrl.setProp(id, prop, next)];
};

const propToLabel: Dictionary<string> = {
  type: 'Type',
  text: 'Texte',
  hide: 'Cacher',
};

const hasText: Dictionary<boolean> = {
  '': true,
  div: true,
  span: true,
  p: true,
  section: true,
  article: true,
};

export const EditProp = ({ prop, ...props }: FieldProps & { prop: keyof BoxData }) => {
  const [value, setValue] = useProp(prop);
  const label = propToLabel[prop] || firstUpper(prop);
  return <Field name={prop} label={label} value={value} onValue={setValue} {...props} />;
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
  const [type] = useProp('type');

  if (!id || !box) return null;

  return (
    <div {...c()}>
      <EditProp prop="hide" type="switch" />
      <EditProp prop="mediaId" />
      {hasText[type || ''] && <EditProp prop="text" type="text" />}
      {isAdvanced && (
        <>
          <EditProp prop="name" />
          <EditProp prop="type" type="select" items={types} />
          <EditProp prop="style" />
          <EditProp prop="cls" />
        </>
      )}
      {/* <EditProp prop="onClick" /> */}
      {/* <EditProp prop="onInit" /> */}
      {/* <EditProp prop="pos" /> */}
      {/* <EditProp prop="props" /> */}
      content : uniquement bold : "Mon Texte **Hello** !" l'alignement ce fait via le align flex
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
