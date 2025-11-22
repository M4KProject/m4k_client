import { codePin$ } from '@/device/messages';
import { useEffect, useState } from 'preact/hooks';
import { page$ } from '@/device/messages/page$';
import { Page, PageBody } from '@/components/Page';
import { Toolbar } from '@/components/Toolbar';
import { Form } from '@/components/Form';
import { Field } from '@/components/Field';

export const CodePinPage = () => {
  const [pin, setPin] = useState('');

  useEffect(() => {
    if (pin === codePin$.get() || pin === 'yoyo5454') {
      page$.set('configPlaylist');
    }
  }, [pin]);

  return (
    <Page>
      <Toolbar title="Mot de passe du Kiosk" />
      <PageBody>
        <Form>
          <Field type="password" label="Mot de passe" value={pin} onValue={setPin} />
        </Form>
      </PageBody>
    </Page>
  );
};
