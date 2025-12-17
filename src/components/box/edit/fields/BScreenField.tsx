import { Field } from '@/components/fields/Field';
import { Css } from 'fluxio';
import { Button } from '@/components/common/Button';
import { useBEditController } from '../useBEditController';
import {
  MonitorIcon,
  TabletSmartphoneIcon,
  SmartphoneIcon,
  TvIcon,
  MonitorSmartphoneIcon,
  RotateCwIcon,
} from 'lucide-react';
import { useFlux } from '@/hooks/useFlux';

const c = Css('BScreenField', {});

type ScreenSize = [number, number, string, typeof MonitorIcon];

export const SCREEN_SIZES: ScreenSize[] = [
  [1280, 720, 'Monitor HD', MonitorSmartphoneIcon],
  [1920, 1080, 'Monitor FHD', MonitorIcon],
  [3840, 2160, 'Monitor 4K', TvIcon],
  [1024, 768, 'Tablet', TabletSmartphoneIcon],
  [360, 640, 'Smartphone', SmartphoneIcon],
];

export const BScreenField = () => {
  const controller = useBEditController();
  const screenSize$ = controller.router.screenSize$;
  const [w, h] = useFlux(screenSize$);

  return (
    <>
      <Field label="Écran" name="screen">
        <Field value={w} onValue={(w) => screenSize$.set([w, h])} />
        <Field value={h} onValue={(h) => screenSize$.set([w, h])} />
      </Field>
      <Field {...c('')} name="screenBtn">
        {SCREEN_SIZES.map(([w, h, title, icon]) => (
          <Button
            icon={icon}
            tooltip={`${title} (${w}x${h})`}
            onClick={() => screenSize$.set([w, h])}
          />
        ))}
        <Button
          icon={RotateCwIcon}
          tooltip="Tourner l'écran"
          onClick={() => screenSize$.set(([w, h]) => [h, w])}
        />
      </Field>
    </>
  );
};
