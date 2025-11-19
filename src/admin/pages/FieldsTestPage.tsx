import { useState } from 'preact/hooks';
import { Css } from 'fluxio';
import { Field } from '@/components/Field';
import { Form } from '@/components/Form';
import { refreshTheme, updateTheme } from '@/utils/theme';

const c = Css('FieldsTestPage', {
  '': {
    col: 1,
    p: 20,
    gap: 20,
    maxWidth: 600,
    margin: '0 auto',
    bg: 'bg',
    fg: 't',
  },
  Title: {
    fontSize: 2,
    bold: 1,
    mb: 20,
  },
  Json: {
    p: 15,
    rounded: 8,
    fontFamily: 'monospace',
    fontSize: 0.9,
    whiteSpace: 'pre',
    overflowX: 'auto',
  },
});

updateTheme({
  isDark: false,
  isUserDark: false,
  primary: '#28A8D9',
  secondary: undefined,
  grey: undefined,
});
refreshTheme();

export const FieldsTestPage = () => {
  const [v, set] = useState({
    text: '',
    number: 5,
    boolean: true,
    color: '#FF0000',
    email: 'toto@gmail.com',
    date: '',
    datetime: '',
    multiline: '',
    password: '',
    seconds: 0,
    select: 0,
  });

  const up = (changes: Partial<typeof v>) => set(p => ({ ...p, ...changes }));

  return (
    <div {...c()}>
      <div {...c('Title')}>Test Fields</div>

      <Form>
        {/* <Field label="Valeurs JSON" type="json" value={v} onValue={set} /> */}
        {/* <Field
          label="Texte"
          type="text"
          value={v.text}
          onValue={v => up({ text: v })}
          placeholder="Entrez du texte"
        />
        <Field
          label="Nombre"
          type="number"
          value={v.number}
          onValue={v => up({ number: v })}
          min={0}
          max={100}
        />
        <Field
          label="Switch"
          type="switch"
          value={v.boolean}
          onValue={v => up({ boolean: v })}
        />
        <Field
          label="Check"
          type="check"
          value={v.boolean}
          onValue={v => up({ boolean: v })}
        />
        <Field
          label="Email"
          type="email"
          value={v.email}
          onValue={v => up({ email: v })}
        />
        <Field
          label="Date"
          type="date"
          value={v.date}
          onValue={v => up({ date: v })}
        />
        <Field
          label="Date"
          type="datetime"
          value={v.date}
          onValue={v => up({ datetime: v })}
        />
        <Field
          label="Multiline"
          type="multiline"
          value={v.multiline}
          onValue={v => up({ multiline: v })}
        />
        <Field
          label="Password"
          type="password"
          value={v.password}
          onValue={v => up({ password: v })}
        />
        <Field
          label="Seconds"
          type="seconds"
          value={v.seconds}
          onValue={v => up({ seconds: v })}
        /> */}
        <Field
          label="Picker"
          name="picker"
          type="picker"
          value={v.select}
          onValue={v => up({ select: v })}
          items={[
            [10, "10"],
            [20, "20"],
            [30, "30"],
          ]}
        />
        <Field
          label="Select"
          name="select"
          type="select"
          value={v.select}
          onValue={v => up({ select: v })}
          items={[
            [10, "10"],
            [20, "20"],
            [30, "30"],
          ]}
        />
        {/* <Field
          label="Color"
          type="color"
          value={v.color}
          onValue={v => up({ color: v })}
        /> */}
      </Form>
    </div>
  );
};
