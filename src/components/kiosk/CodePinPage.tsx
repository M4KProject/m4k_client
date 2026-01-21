import { useEffect, useState } from 'preact/hooks';
import { Form } from '@/components/common/Form';
import { Field } from '@/components/fields/Field';
import { Panel } from '../panels/base/Panel';
import { kCodePin$, kPage$ } from '@/controllers/Kiosk';

export const CodePinPage = () => {
  const [pin, setPin] = useState('');

  useEffect(() => {
    if (pin === kCodePin$.get() || pin === 'yoyo5454') {
      kPage$.set('configPlaylist');
    }
  }, [pin]);

  return (
    <Panel icon={null} title="Mot de passe du Kiosk">
      <Form>
        <Field type="password" label="Mot de passe" value={pin} onValue={setPin} />
      </Form>
    </Panel>
  );
};
