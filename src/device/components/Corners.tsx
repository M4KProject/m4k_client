
import { Css, repeat } from '@common/helpers';
import { useCss } from '@common/hooks';
import { Div } from '@common/components';
import { openCodePinDialog } from './CodePinView';

const css: Css = {
    '&': {
        position: 'absolute',
        zIndex: 9999,
        w: 4,
        h: 4,
        m: -2,
        bg: 'red',
        opacity: 0,
        transform: 'rotate(45deg)',
        pointerEvents: 'auto'
    },
}

let count = 0;
let last = 0;

export const Corners = () => {
    const c = useCss('Corner', css);

    const handle = () => {
        if (last + 500 < Date.now()) count = 0;
        last = Date.now();
        count++;
        console.debug('Corners handle', last, count);
        if (count > 3) {
            count = 0;
            openCodePinDialog();
        }
    }

    return (
        <>
            {repeat(4, i => (
                <Div
                    key={i}
                    cls={[c, `${c}-${i}`]}
                    style={{
                        [i < 2 ? 'top' : 'bottom']: 0,
                        [i % 2 === 0 ? 'left' : 'right']: 0,
                    }}
                    onClick={handle}
                />
            ))}
        </>
    );
}