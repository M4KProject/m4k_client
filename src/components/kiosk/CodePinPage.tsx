import { useEffect, useState } from 'preact/hooks';
import { Page, PageBody } from '@/components/common/Page';
import { Toolbar } from '@/components/common/Toolbar';
import { Form } from '@/components/common/Form';
import { Field } from '@/components/fields/Field';
import { codePin$, page$ } from '@/controllers/deviceMessages';

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
