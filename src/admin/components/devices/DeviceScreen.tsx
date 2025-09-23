import { Css } from '@common/ui';

const c = Css('DeviceScreen', {
  '': {
    flex: 1,
    rounded: 2,
    bg: '#000',
    m: 0.5,
    position: 'relative',
    bgMode: 'contain',
  },
  NoCapture: {
    fCenter: 1,
    bg: '#FFF',
    fg: '#000',
    p: 1,
  },
  WH: {
    position: 'absolute',
    xy: 0,
    fg: '#FFF',
    m: 1,
  },
});

interface DeviceScreenProps {
  captureUrl: string;
  deviceWidth: number;
  deviceHeight: number;
}

export const DeviceScreen = ({ captureUrl, deviceWidth, deviceHeight }: DeviceScreenProps) => {
  return (
    <div
      class={c()}
      style={{
        backgroundImage: captureUrl,
      }}
    >
      <div class={c('WH')}>
        {deviceWidth} × {deviceHeight}
      </div>
      {!captureUrl && <div class={c('NoCapture')}>Aucune capture disponible</div>}
    </div>
  );
};
