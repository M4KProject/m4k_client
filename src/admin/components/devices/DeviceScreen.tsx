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
    fCenter: [],
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
      {...c()}
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
