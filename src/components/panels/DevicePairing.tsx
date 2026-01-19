import { Css, toError } from 'fluxio';
import { useState } from 'preact/hooks';
import { useApi } from '@/hooks/useApi';
import { Field } from '@/components/fields/Field';
import { Button } from '@/components/common/Button';
import { Form } from '@/components/common/Form';
import { useWindowController } from '../common/WindowController';
import { useGroup } from '@/hooks/useApi2';

const c = Css('DevicePairing', {
  Buttons: {
    row: ['center', 'around'],
  },
});

export const DevicePairing = () => {
  const api = useApi();
  const win = useWindowController();
  const [key, setKey] = useState('');
  const group = useGroup();

  const handlePairing = async () => {
    if (!key) return;

    const cleanKey = key.toLowerCase().replace(/ /g, '');

    try {
      console.log('Tentative de pairage avec le code:', cleanKey);
      await api.pb.req('GET', `pair/${cleanKey}/${group}`);
      win.close();
    } catch (e) {
      const error = toError(e);
      console.error('Erreur lors du pairage:', error);
      alert('Erreur lors du pairage. Vérifiez le code et réessayez.');
      win.close();
    }
  };

  return (
    <Form>
      <Field label="Code de pairage" value={key} onValue={setKey} />
      <div {...c('Buttons')}>
        <Button title="Pairer l'écran" color="primary" onClick={handlePairing} />
      </div>
    </Form>
  );
};
