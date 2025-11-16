import { Css } from "fluxio";
import { useRef } from "preact/hooks";

const c = Css('ColorPicker', {
  '': {
    position: 'absolute',
    xy: '50%',
    translateX: '-50%',
    translateY: '-50%',
    wh: 300,
    bg: 'bg',
    col: 1,
  },

});

export const ColorPicker = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    

    return (
        <div {...c()}>
            <canvas ref={canvasRef} />

        </div>
    )
}