import { useState } from 'preact/hooks';
import { Css } from 'fluxio';
import { Field } from '@/components/Field';
import { Form } from '@/components/Form';

const c = Css('FieldsTestPage', {
  '': {
    col: 1,
    p: 20,
    gap: 20,
    maxWidth: 600,
    margin: '0 auto',
  },
  Title: {
    fontSize: 2,
    bold: 1,
    mb: 20,
  },
  Json: {
    p: 15,
    bg: '#1e1e1e',
    fg: '#d4d4d4',
    rounded: 8,
    fontFamily: 'monospace',
    fontSize: 0.9,
    whiteSpace: 'pre',
    overflowX: 'auto',
  },
});

export const FieldsTestPage = () => {
  const [state, setState] = useState({ text: '', number: 5 });

  return (
    <div {...c()}>
      <div {...c('Title')}>Test Fields</div>

      <Form>
        <Field
          label="Texte"
          type="text"
          value={state.text}
          onValue={text => setState(prev => ({ ...prev, text }))}
          placeholder="Entrez du texte"
        />
        <Field
          label="Nombre"
          type="number"
          value={state.number}
          onValue={number => setState(prev => ({ ...prev, number }))}
          min={0}
          max={100}
        />
        <Field label="Valeurs JSON" type="json" value={state} onValue={setState} />
      </Form>
    </div>
  );
};
