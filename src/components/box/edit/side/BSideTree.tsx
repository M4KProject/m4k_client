import {
  MonitorIcon,
  TabletSmartphoneIcon,
  SmartphoneIcon,
  TvIcon,
  MonitorSmartphoneIcon,
  RotateCwIcon,
} from 'lucide-react';
import { useBEditController } from '../useBEditController';
import { Field } from '@/components/fields/Field';
import { Button } from '@/components/common/Button';
import { useFlux } from '@/hooks/useFlux';
import { BSideNode } from './BSideNode';
import { Css } from 'fluxio';
import { BSideSep } from './BSideSep';
import { pageType, zoneType } from '../../BController';
import { BFieldType } from '../fields/BTypeField';
import { BScreenField } from '../fields/BScreenField';

const c = Css('BSideTree', {});

export const BSideTree = () => {
  const controller = useBEditController();
  const type = useFlux(controller.select$.map((s) => (s ? s.t : '')));

  //   const [sizeIndex, setSizeIndex] = useState(0);
  //   const [sizeWidth, sizeHeight, sizeTitle, SizeIcon] = SCREEN_SIZES[sizeIndex]!;

  //   const toggleScreenSize = () => {
  //     const nextIndex = normalizeIndex(sizeIndex + 1, SCREEN_SIZES.length);
  //     setSizeIndex(nextIndex);
  //     const [w, h] = SCREEN_SIZES[nextIndex]!;
  //     controller?.panZoom.setSize(w, h);
  //   };

  console.debug('BSideTree', type);

  return (
    <div {...c('')}>
      <BFieldType />
      <BSideSep />
      <BSideNode i={0} />
      <Button icon={pageType.icon} title="Ajouter une Page" color="primary" />
      {type && type !== 'root' && (
        <Button icon={zoneType.icon} title="Ajouter une zone" color="primary" />
      )}
      <BSideSep />
      {type === 'root' ||
        (type === '' && (
          <>
            <BScreenField />
          </>
        ))}
      {/* <Button icon={PlusIcon} title="Ajouter une page" /> */}
    </div>
  );
};
