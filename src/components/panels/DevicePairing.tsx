import { Css, toError } from 'fluxio';
import { useState } from 'preact/hooks';
import { Field } from '@/components/fields/Field';
import { Button } from '@/components/common/Button';
import { Form } from '@/components/common/Form';
import { useWindowController } from '../common/WindowController';
import { useGroupId } from '@/hooks/useApi2';
import { api2 } from '@/api2';

const c = Css('DevicePairing', {
  Buttons: {
    row: ['center', 'around'],
  },
});

export const DevicePairing = () => {
  const win = useWindowController();
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  const handlePairing = async () => {
    try {
      if ((key+'').trim().length === 0) throw toError('code vide');
      console.log('Tentative de pairage avec le code:', key);
      await api2.devices.pair(key);
      win.close();
    } catch (e) {
      const error = toError(e);
      setError('Erreur vérifiez le code et réessayez ! ' + error.message);
    }
  };

  return (
    <Form>
      <Field label="Code de pairage" value={key} onValue={setKey} error={error} />
      <div {...c('Buttons')}>
        <Button title="Pairer l'écran" color="primary" onClick={handlePairing} />
      </div>
    </Form>
  );
};
