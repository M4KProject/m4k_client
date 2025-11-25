import { Css } from 'fluxio';

const c = Css('DeviceScreen', {
  '': {
    flex: 1,
    rounded: 5,
    bg: '#000',
    m: 4,
    position: 'relative',
    bgMode: 'contain',
  },
  NoCapture: {
    center: 1,
    bg: '#FFF',
    fg: '#000',
    p: 8,
  },
  WH: {
    position: 'absolute',
    xy: 0,
    fg: '#FFF',
    m: 8,
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
      {...c('')}
      style={{
        backgroundImage: captureUrl,
      }}
    >
      <div {...c('WH')}>
        {deviceWidth} × {deviceHeight}
      </div>
      {!captureUrl && <div {...c('NoCapture')}>Aucune capture disponible</div>}
    </div>
  );
};
