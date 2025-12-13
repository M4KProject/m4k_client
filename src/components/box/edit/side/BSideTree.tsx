import {
  MonitorIcon,
  TabletSmartphoneIcon,
  SmartphoneIcon,
  TvIcon,
  MonitorSmartphoneIcon,
  RotateCwIcon,
  FileIcon,
  SquareDashedMousePointerIcon,
  ClapperboardIcon,
  ImagePlusIcon,
  EarthIcon,
} from 'lucide-react';
import { useBEditController } from '../useBEditController';
import { Field } from '@/components/fields/Field';
import { Button, ButtonProps } from '@/components/common/Button';
import { useFlux } from '@/hooks/useFlux';
import { BSideNode } from './BSideNode';
import { Css } from 'fluxio';
import { BSideSep } from './BSideSep';
import { BField, useProp } from '../BField';
import { MediaIcon, mediaType, pageType, PlayerIcon, playerType, TextIcon, textType, WebIcon, webType, ZoneIcon, zoneType } from '../../BController';
import { Comp } from '@/utils/comp';

const c = Css('BSideTree', {});

type ScreenSize = [number, number, string, typeof MonitorIcon];

export const SCREEN_SIZES: ScreenSize[] = [
  [1280, 720, 'Monitor HD', MonitorSmartphoneIcon],
  [1920, 1080, 'Monitor FHD', MonitorIcon],
  [3840, 2160, 'Monitor 4K', TvIcon],
  [1024, 768, 'Tablet', TabletSmartphoneIcon],
  [360, 640, 'Smartphone', SmartphoneIcon],
];

export const BTypeButton = ({ value, ...props }: { value: string } & ButtonProps) => {
  const [type, setType] = useProp('t');

  const selected = type === value;

  const handle = () => {
    if (selected) return;
    setType(value);
  }

  return (
    <Button {...props} selected={selected} onClick={handle} />
  )
}

export const BFieldType = () => {
  const controller = useBEditController();
  const entries = Object.entries(controller.registry||{}).filter(e => e[0] !== 'root');
  const types = entries.map(([type, config]) => [type, config.icon] as [string, any]);

  return (
    <Field>
      <BTypeButton value="zone" icon={ZoneIcon} />
      <BTypeButton value="player" icon={PlayerIcon} />
      <BTypeButton value="media" icon={MediaIcon} />
      <BTypeButton value="text" icon={TextIcon} />
      <BTypeButton value="web" icon={WebIcon} />
    </Field>
  )
}

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

  console.debug('BSideTree', type);

  return (
    <div {...c('')}>
      <BFieldType />
      <BSideSep />
      <BSideNode i={0} />
      <Button icon={pageType.icon} title="Ajouter une Page" color="primary" />
      {(type && type !== "root") && (
        <Button icon={zoneType.icon} title="Ajouter une zone" color="primary" />
      )}
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
              icon={RotateCwIcon}
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
