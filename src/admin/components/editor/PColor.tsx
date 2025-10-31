import type { PProps } from './interfaces';
import { SketchPicker } from 'react-color';
import { CSSProperties, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { getColors } from './bEdit';
import B from './B';

function toHex(c: number) {
  const hex = Math.round(c).toString(16);
  return hex.length == 1 ? '0' + hex : hex;
}

function rgbToHex(rgb: { r: number; g: number; b: number; a?: number }) {
  return (
    '#' + toHex(rgb.r) + toHex(rgb.g) + toHex(rgb.b) + (rgb.a !== undefined && rgb.a < 1 ? toHex(rgb.a * 255) : '')
  );
}

function pH(hex: string, start: number, end: number, mul: number) {
  const p = hex.substring(start, end);
  return p.length ? parseInt(p, 16) * mul : undefined;
}

function hexToRgb(hex: string) {
  try {
    if (hex.startsWith('#')) {
      if (hex.length === 4 || hex.length === 5) {
        return {
          r: pH(hex, 1, 2, 255 / 15)!,
          g: pH(hex, 2, 3, 255 / 15)!,
          b: pH(hex, 3, 4, 255 / 15)!,
          a: pH(hex, 4, 5, 1 / 15),
        };
      } else if (hex.length === 7 || hex.length === 9) {
        return {
          r: pH(hex, 1, 3, 1)!,
          g: pH(hex, 3, 5, 1)!,
          b: pH(hex, 5, 7, 1)!,
          a: pH(hex, 7, 9, 1 / 255),
        };
      }
    }
  } catch (error) {
    console.error('hexToRgb', hex, error);
  }
}

export default function PColor({ v, setV, b }: PProps) {
  const [show, setShow] = useState(false);
  const [presetColors, setPresetColor] = useState<string[]>([]);

  useEffect(() => setShow(false), [b]);

  const rgb = hexToRgb(v);
  delete rgb?.a;
  const btnStyle: CSSProperties = {
    flex: 1,
    background: rgb ? rgbToHex(rgb) : '#FFF',
    color: (rgb ? rgb.r + rgb.g + rgb.b < 128 * 3 : false) ? '#FFF' : '#000',
  };

  if (show) {
    return (
      <div className="PInput PInput-row">
        <SketchPicker color={v} presetColors={presetColors} onChange={(color) => setV(rgbToHex(color.rgb))} />
        <Button
          style={btnStyle}
          onClick={() => {
            console.debug('PColor hide');
            setShow(false);
          }}
        >
          Fermer
        </Button>
      </div>
    );
  }

  return (
    <div className="PInput">
      <Button
        style={btnStyle}
        onClick={() => {
          console.debug('PColor show');
          setShow(true);
          setPresetColor(getColors(B.root));
        }}
      >
        Modifier
      </Button>
    </div>
  );
}
