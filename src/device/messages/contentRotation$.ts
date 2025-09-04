import { setCss } from "@common/helpers";
import { newMsg } from "@common/helpers/Msg";

export type ContentRotation = 0|90|180|270;
export const isContentRotation = (v: number) => v===0||v===90||v===180||v===270;
export const contentRotation$ = newMsg<0|90|180|270>(0, 'contentRotation', true, isContentRotation);

const applyContentRotation = () => {
    const v = contentRotation$.v;
    console.debug('apply contentRotation', v);

    let w = window.innerWidth;
    let h = window.innerHeight;

    if (v === 90 || v === 270) {
        const t = w;
        w = h;
        h = t;
    }

    setCss('contentRotation', v === 0 ? {} : {
        body: {
            w: w + 'px',
            h: h + 'px',
            transform: `rotate(${v}deg)`,
            transformOrigin: '50% 50%',
            position: 'fixed',
            top: '50%',
            left: '50%',
            marginTop: (-h/2) + 'px',
            marginLeft: (-w/2) + 'px',
            overflow: 'hidden'
        }
    })
}

contentRotation$.on(applyContentRotation);
applyContentRotation();