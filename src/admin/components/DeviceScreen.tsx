import { Css, flexCenter } from '@common/helpers';
import { useCss } from '@common/hooks';
import { Div } from '@common/components';

const css: Css = {
    '&': {
        flex: 1,
        rounded: 2,
        bg: '#000',
        m: 0.5,
        position: 'relative',
        bgMode: 'contain',
    },
    '&NoCapture': {
        ...flexCenter(),
        bg: '#FFF',
        fg: '#000',
        p: 1,
    },
    '&WH': {
        position: 'absolute',
        xy: 0,
        fg: '#FFF',
        m: 1,
    },
};

interface DeviceScreenProps {
    captureUrl: string;
    deviceWidth: number;
    deviceHeight: number;
}

export const DeviceScreen = ({ captureUrl, deviceWidth, deviceHeight }: DeviceScreenProps) => {
    const c = useCss('DeviceScreen', css);

    return (
        <Div cls={c} style={{
            backgroundImage: captureUrl
        }}>
            <Div cls={`${c}WH`}>
                {deviceWidth} × {deviceHeight}
            </Div>
            {!captureUrl && (
                <Div cls={`${c}NoCapture`}>
                    Aucune capture disponible
                </Div>
            )}
        </Div>
    );
};