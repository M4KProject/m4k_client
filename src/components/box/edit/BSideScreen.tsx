import {
  MonitorIcon,
  TabletSmartphoneIcon,
  SmartphoneIcon,
  TvIcon,
  MonitorSmartphoneIcon,
  RotateCw,
  PlusIcon,
} from 'lucide-react';
import { useBEditController } from './useBEditController';
import { BSideContent, BSideSep } from './BSideContent';
import { Field } from '@/components/fields/Field';
import { Button } from '@/components/common/Button';
import { BField } from './BField';
import { useFlux } from '@/hooks/useFlux';

type ScreenSize = [number, number, string, typeof MonitorIcon];

export const SCREEN_SIZES: ScreenSize[] = [
  [1280, 720, 'Monitor HD', MonitorSmartphoneIcon],
  [1920, 1080, 'Monitor FHD', MonitorIcon],
  [3840, 2160, 'Monitor 4K', TvIcon],
  [1024, 768, 'Tablet', TabletSmartphoneIcon],
  [360, 640, 'Smartphone', SmartphoneIcon],
];

export const BSideScreen = () => {
  const controller = useBEditController()!;
  const screenSize$ = controller.router.screenSize$;
  const [w, h] = useFlux(screenSize$);

  //   const [sizeIndex, setSizeIndex] = useState(0);
  //   const [sizeWidth, sizeHeight, sizeTitle, SizeIcon] = SCREEN_SIZES[sizeIndex]!;

  //   const toggleScreenSize = () => {
  //     const nextIndex = normalizeIndex(sizeIndex + 1, SCREEN_SIZES.length);
  //     setSizeIndex(nextIndex);
  //     const [w, h] = SCREEN_SIZES[nextIndex]!;
  //     controller?.panZoom.setSize(w, h);
  //   };

  return (
    <BSideContent>
      <Field>
        {SCREEN_SIZES.map(([w, h, title, icon]) => (
          <Button
            icon={icon}
            tooltip={`${title} (${w}x${h})`}
            onClick={() => screenSize$.set([w, h])}
          />
        ))}
      </Field>
      <Button
        icon={RotateCw}
        title="Tourner l'écran"
        onClick={() => screenSize$.set(([w, h]) => [h, w])}
      />
      <Field label="Écran">
        <Field value={w} onValue={w => screenSize$.set([w, h])} />
        <Field value={h} onValue={h => screenSize$.set([w, h])} />
      </Field>
      <BSideSep />
      {/* <Button icon={PlusIcon} title="Ajouter une page" /> */}
    </BSideContent>
  );
};
