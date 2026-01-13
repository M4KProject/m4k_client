import { Css } from 'fluxio';
import { useFlux } from '@/hooks/useFlux';
import { useBEditController } from './useBEditController';
import { isAnimStateOpen, useAnimState } from '@/hooks/useAnimState';
import { BSideTree } from './side/BSideTree';
import { BSideMedia } from './side/BSideMedia';
import { BSideFilter } from './side/BSideFilter';
import { useMemo } from 'preact/hooks';
import { BSideText } from './side/BSideText';
import { BSideWeb } from './side/BSideWeb';
import { BSideAdvanced } from './side/BSideAdvanced';
import { BSideNode } from './side/BSideNode';
import { BSideSep } from './side/BSideSep';
import { BFieldType } from './fields/BTypeField';
import { Field } from '@/components/fields/Field';
import { Button } from '@/components/common/Button';
import { ClipboardCopyIcon, ClipboardPasteIcon, ClipboardXIcon, DeleteIcon } from 'lucide-react';
import { BScreenField } from './fields/BScreenField';
import { PageIcon, ZoneIcon } from '../BController';

const BSIDE_WIDTH = 260;

const c = Css('BSide', {
  '': {
    transition: 0.4,
    w: BSIDE_WIDTH,
    h: '100%',
  },
  '-open': {},
  Body: {
    position: 'absolute',
    elevation: 2,
    w: BSIDE_WIDTH,
    h: '100%',
    p: 2,
    bg: 'bg',
    overflowX: 'hidden',
    overflowY: 'auto',
    col: ['stretch', 'start'],
    zIndex: 20,
  },
  // ' &Content': {
  //   transition: 0.4,
  //   translateX: '-100%',
  // },
  // '-open &Content': {
  //   translateX: '0%',
  // },
  '> *': {
    flexShrink: 0,
  },
  ' .FieldLabel': {
    w: 80,
  },
  ' .Field-col .FieldLabel': {
    w: '100%',
  },
});

export const BSide = () => {
  const controller = useBEditController();
  const { onDelete, onCut, onCopy, onPaste, onUp, onDown, onLeft, onRight } = controller;
  const type = useFlux(controller.select$.map((s) => (s ? s.t : '')));
  // const show$ = useMemo(() => controller.side$.map((p) => !!p), [controller]);
  // const side$ = useMemo(() => controller.side$.filter((p) => !!p), [controller]);
  // const show = useFlux(show$);
  // const side = useFlux(side$);
  // const animState = useAnimState(show, 400);
  // const unmounted = animState === 'unmounted';
  // if (unmounted) return null;
  // <div {...c('', isAnimStateOpen(animState) && `-open`)}></div>

  return (
    <div {...c('')}>
      <div {...c('Body')}>
        <Button icon={PageIcon} title="Ajouter une Page" color="primary" />
        {type && type !== 'root' && (
          <Button icon={ZoneIcon} title="Ajouter une zone" color="primary" />
        )}
        <BSideNode i={0} />
        <BSideSep />
        <BFieldType />
        <Field name="copy">
          <Button icon={DeleteIcon} onClick={onDelete} tooltip="Supprimer (suppr)" />
          <Button icon={ClipboardXIcon} onClick={onCut} tooltip="Couper (ctrl x)" />
          <Button icon={ClipboardCopyIcon} onClick={onCopy} tooltip="Copier (ctrl c)" />
          <Button icon={ClipboardPasteIcon} onClick={onPaste} tooltip="Coller (ctrl v)" />
        </Field>
        <Field name="move">
          <Button icon={ClipboardPasteIcon} onClick={onUp} tooltip="Monter (ctrl ▲)" />
          <Button icon={ClipboardPasteIcon} onClick={onDown} tooltip="Décendre (ctrl ▼)" />
          <Button icon={ClipboardPasteIcon} onClick={onLeft} tooltip="Décendre (ctrl ◄)" />
          <Button icon={ClipboardPasteIcon} onClick={onRight} tooltip="Décendre (ctrl ►)" />
        </Field>
        <BSideSep />
        {type === 'root' ||
          (type === '' && (
            <>
              <BScreenField />
            </>
          ))}
        {type === 'page' && (
          <BSideFilter />
        )}

        {/* <BSideTree /> */}

        {/* {side === 'tree' && <BSideTree />}
        {side === 'media' && <BSideMedia />}
        {side === 'web' && <BSideWeb />}
        {side === 'text' && <BSideText />}
        {side === 'filter' && <BSideFilter />}
        {side === 'advanced' && <BSideAdvanced />} */}
      </div>
    </div>
  );
};

// {page === 'advanced' && <BSideAdvanced />}
// {page === 'hierarchy' && <BSideHierarchy />}
// {page === 'layout' && <BSideLayout />}
// {/* {page === 'media' && <BSideMedia />} */}
// {page === 'text' && <BSideText />}
// {page === 'playlist' && <BSideMedia />}
// {/* {page === 'planification' && <BSidePlanification />} */}

// const i = select?.i;
// const item = select?.item;
// const [nType] = useProp('t');
// const type = nType || 'box';
// const config = controller?.registry[type] || ({} as Partial<BType>);

// console.debug('BProps', i, item, click)

// if (!isUInt(i) || !item) return null;

// const isHierarchy = page === 'hierarchy';
// const isLayout = isHierarchy && config.layout;

//     // <BMenuButton title="Hiérarchie" icon={GroupIcon} page="hierarchy" />
//     // <BMenuButton title="Media" icon={ImageIcon} page="media" />
//     // <BMenuButton title="Texte" icon={TextIcon} page="text" />
//     // <BMenuButton title="Carrousel" icon={GalleryHorizontalIcon} page="carrousel" />
//     // <BMenuButton title="Planification" icon={CalendarClockIcon} page="planification" />
//     // <BMenuButton title="Avancé" icon={ExpandIcon} page="advanced" />

//       {config.r && (
//         <Panel>
//           <Field label="Ajouter">
//             {registryEntries.map(([t, config], key) => {
//               const Icon = config?.icon || Square;
//               if (t === 'root' || t === 'rect') return null;
//               return (
//                 <Button
//                   key={key}
//                   icon={Icon}
//                   tooltip={config?.label || ''}
//                   onClick={() => {
//                     const next: Writable<Partial<BItem>> = { p: i, t };
//                     if (type === 'text') next.b = 'Mon texte !';
//                     controller?.add(next);
//                   }}
//                 />
//               );
//             })}
//           </Field>
//         </Panel>
//       )}
//       {config.m && (
//         <Panel>
//           <BMedias />
//         </Panel>
//       )}
// );

// import { Css } from 'fluxio';

// const c = Css('BButtons', {
//   '': {
//     col: 1,
//   },
// });

// export const BButtons = () => {
//   return (
//     <div {...c('')}>
//       TREE
//     </div>
//   );
// };
