import { addHsl, Css, darken, lighten, round, setHsl, setRgb, toHsl, toRgb } from "fluxio";
import { useState } from "preact/hooks";
import { Field } from "@/components/Field";
import { theme$ } from "@/utils/theme";

const c = Css('ColorPicker', {
  '': {
    position: 'absolute',
    xy: '100',
    col: 1,
    p: 2,
    gap: 10,
    bg: 'bg',
    elevation: 3,
  },
  Variations: {
    row: 1,
    gap: 5,
  },
  Color: {
    wh: 30,
    m: 2,
    rounded: 5,
    cursor: 'pointer',
    border: '2px solid transparent',
  },
  'Color:hover': {
    borderColor: 'border',
  },
  ' .FieldLabel': {
    w: 70,
  }
});

export const ColorPicker = () => {
  const [color, setColor] = useState<string|undefined>('#697689');
  const hsl = toHsl(color);
  const rgb = toRgb(color);

  const theme = theme$.get();
  const p = theme.primary || '#28A8D9';
  const s = theme.secondary || addHsl(p, { h: 360 / 3 });
  const g = setHsl(color, { s: 0, l: 50 });

  const ls = [10, 20, 40, 60, 80, 90];

  const variations = [
    [
        p,
        s,
        ...[0, 50, 100].map(l => setHsl(color, { l })),
        undefined,
    ],
    [ "#e20000ff", "#ffa600ff", "#fffb00ff", "#07db00ff", "#0063f7ff", "#a300e4ff" ],
    ls.map(l => setHsl(color, { l })),
  ];

  return (
    <div {...c()}>
      <Field
        type="color"
        label="Couleur"
        value={color}
        onValue={setColor}
      />

    {variations.map(v => (
        <div {...c('Variations')}>
            {v.map(col => (
                <div
                    key={col}
                    {...c('Color')}
                    style={{ backgroundColor: col }}
                    onClick={() => setColor(col)}
                />
            ))}           
        </div>
    ))}
    <Field label="HSL">
        <Field
            type="number"
            value={round(hsl.h)}
            onValue={h => setColor(setHsl(color, { h }))}
            props={{ min: 0, max: 360 }}
        />

        <Field
            type="number"
            value={round(hsl.s)}
            onValue={s => setColor(setHsl(color, { s }))}
            props={{ min: 0, max: 100 }}
        />

        <Field
            type="number"
            value={round(hsl.l)}
            onValue={l => setColor(setHsl(color, { l }))}
            props={{ min: 0, max: 100 }}
        />
    </Field>
    <Field label="RGB">
        <Field
            type="number"
            value={rgb.r}
            onValue={r => setColor(setRgb(color, { r }))}
            props={{ min: 0, max: 360 }}
        />
        <Field
            type="number"
            value={rgb.g}
            onValue={g => setColor(setRgb(color, { g }))}
            props={{ min: 0, max: 100 }}
        />
        <Field
            type="number"
            value={rgb.b}
            onValue={b => setColor(setRgb(color, { b }))}
            props={{ min: 0, max: 100 }}
        />
    </Field>
    <Field
        label="Alpha"
        type="number"
        value={rgb.a * 100}
        onValue={a => setColor(setRgb(color, { a: a / 100 }))}
        props={{ min: 0, max: 100 }}
    />
    </div>
  );
};