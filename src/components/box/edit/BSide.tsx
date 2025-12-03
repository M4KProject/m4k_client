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
import { Field } from '@/components/fields/Field';
import { Tr } from '@/components/common/Tr';
import { useFlux, useFluxMemo } from '@/hooks/useFlux';
import { BType, BData, BItem, BPropNext } from '@/components/box/bTypes';
import { isAdvanced$, setIsAdvanced } from '@/router';
import { Button, ButtonProps } from '@/components/common/Button';
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
import { DivProps } from '@/components/common/types';
import { Comp } from '@/utils/comp';
import { useBEditController } from './useBEditController';
import { isAnimStateOpen, useAnimState } from '@/hooks/useAnimState';
import { BField } from './BField';
import { BSideHierarchy } from './BSideHierarchy';
import { BSideAdvanced } from './BSideAdvanced';
import { BSideLayout } from './BSideLayout';
import { BSideText } from './BSideText';
import { BSideMedia } from './BSideMedia';
import { BSidePlaylist } from './BSidePlaylist';
import { BSidePlanification } from './BSidePlanification';

const c = Css('BSide', {
  '': {
    position: 'relative',
    transition: 0.4,
    w: 300,
    h: '100%',
  },
  Content: {
    position: 'absolute',
    elevation: 2,
    w: 300,
    h: '100%',
    bg: 'bg',
    overflowX: 'hidden',
    overflowY: 'auto',
    col: ['stretch', 'start'],
    transition: 0.4,
    translateX: '-100%',
    zIndex: 10,
    p: 8,
  },
  '-open': {
  },
  '-open &Content': {
    translateX: '0%',
  },
  '> *': {
    flexShrink: 0,
  },
  ' .FieldLabel': {
    w: 80,
  },
});

export const BSide = () => {
  const controller = useBEditController()!;
  const page = useFlux(controller.page$);
  const animState = useAnimState(!!page, 400);
  const unmounted = animState === 'unmounted';
  
  if (unmounted) return null;

  return (
    <div {...c('', isAnimStateOpen(animState) && `-open`)}>
      <div {...c('Content')}>
        {page === 'advanced' && <BSideAdvanced />}
        {page === 'hierarchy' && <BSideHierarchy />}
        {page === 'layout' && <BSideLayout />}
        {page === 'media' && <BSideMedia />}
        {page === 'text' && <BSideText />}
        {page === 'playlist' && <BSidePlaylist />}
        {page === 'planification' && <BSidePlanification />}
      </div>
    </div>
  );

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
};

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
