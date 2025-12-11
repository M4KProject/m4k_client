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
  'Body > div': {
    col: ['stretch', 'start'],
    p: 4,
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
  const show$ = useMemo(() => controller.side$.map((p) => !!p), [controller]);
  const side$ = useMemo(() => controller.side$.filter((p) => !!p), [controller]);
  const show = useFlux(show$);
  const side = useFlux(side$);
  const animState = useAnimState(show, 400);
  const unmounted = animState === 'unmounted';

  if (unmounted) return null;

  return (
    <div {...c('', isAnimStateOpen(animState) && `-open`)}>
      <div {...c('Body')}>
        {side === 'tree' && <BSideTree />}
        {side === 'media' && <BSideMedia />}
        {side === 'web' && <BSideWeb />}
        {side === 'text' && <BSideText />}
        {side === 'filter' && <BSideFilter />}
        {side === 'advanced' && <BSideAdvanced />}
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
