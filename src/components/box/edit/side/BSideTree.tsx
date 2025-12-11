import {
  MonitorIcon,
  TabletSmartphoneIcon,
  SmartphoneIcon,
  TvIcon,
  MonitorSmartphoneIcon,
  RotateCw,
  FileIcon,
  SquareDashedMousePointerIcon,
  ClapperboardIcon,
  ImagePlusIcon,
  EarthIcon,
} from 'lucide-react';
import { useBEditController } from '../useBEditController';
import { Field } from '@/components/fields/Field';
import { Button } from '@/components/common/Button';
import { useFlux } from '@/hooks/useFlux';
import { BSideNode } from './BSideNode';
import { Css } from 'fluxio';
import { BSideSep } from './BSideSep';

const c = Css('BSideTree', {});

type ScreenSize = [number, number, string, typeof MonitorIcon];

export const SCREEN_SIZES: ScreenSize[] = [
  [1280, 720, 'Monitor HD', MonitorSmartphoneIcon],
  [1920, 1080, 'Monitor FHD', MonitorIcon],
  [3840, 2160, 'Monitor 4K', TvIcon],
  [1024, 768, 'Tablet', TabletSmartphoneIcon],
  [360, 640, 'Smartphone', SmartphoneIcon],
];

export const BSideTree = () => {
  const controller = useBEditController();
  const screenSize$ = controller.router.screenSize$;
  const [w, h] = useFlux(screenSize$);
  const type = useFlux(controller.select$.map((s) => (s ? s.t : '')));

  //   const [sizeIndex, setSizeIndex] = useState(0);
  //   const [sizeWidth, sizeHeight, sizeTitle, SizeIcon] = SCREEN_SIZES[sizeIndex]!;

  //   const toggleScreenSize = () => {
  //     const nextIndex = normalizeIndex(sizeIndex + 1, SCREEN_SIZES.length);
  //     setSizeIndex(nextIndex);
  //     const [w, h] = SCREEN_SIZES[nextIndex]!;
  //     controller?.panZoom.setSize(w, h);
  //   };

  return (
    <div {...c('')}>
      <BSideNode i={0} />
      <Field label="Ajouter">
        <Button
          color="primary"
          icon={FileIcon}
          tooltip="Ajouter une Page"
          onClick={controller.onAddPage}
        />
        <Button
          color="primary"
          icon={SquareDashedMousePointerIcon}
          tooltip="Ajouter une Zone"
          onClick={controller.onAddZone}
        />
        <Button
          color="primary"
          icon={ClapperboardIcon}
          tooltip="Ajouter un Player"
          onClick={controller.onAddTimeline}
        />
        <Button
          color="primary"
          icon={ImagePlusIcon}
          tooltip="Ajouter un Média"
          onClick={controller.onAddMedia}
        />
        <Button
          color="primary"
          icon={EarthIcon}
          tooltip="Ajouter une Vue Web"
          onClick={controller.onAddWeb}
        />
      </Field>
      <BSideSep />
      {type === 'root' ||
        (type === '' && (
          <>
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
              <Field value={w} onValue={(w) => screenSize$.set([w, h])} />
              <Field value={h} onValue={(h) => screenSize$.set([w, h])} />
            </Field>
          </>
        ))}
      {/* <Button icon={PlusIcon} title="Ajouter une page" /> */}
    </div>
  );
};
