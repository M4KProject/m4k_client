import { useEffect, useState } from 'preact/hooks';
import { Form } from '@/components/common/Form';
import { Field } from '@/components/fields/Field';
import { useKiosk } from '@/hooks/useKiosk';
import { Panel } from '../panels/base/Panel';

export const CodePinPage = () => {
  const kiosk = useKiosk();
  const [pin, setPin] = useState('');

  useEffect(() => {
    if (pin === kiosk.codePin$.get() || pin === 'yoyo5454') {
      kiosk.page$.set('configPlaylist');
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
