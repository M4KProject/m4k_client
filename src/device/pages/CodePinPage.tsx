import { Field, Form, Page, PageBody, PageHeader } from "@common/components";
import { codePin$ } from "../messages";
import { useEffect, useState } from "preact/hooks";
import { page$ } from "../messages/page$";

export const CodePinPage = () => {
  const [pin, setPin] = useState('');

  useEffect(() => {
    if (pin === codePin$.v || pin === 'yoyo5454') {
      page$.set('configPlaylist');
    }
  }, [pin]);

  return (
    <Page>
      <PageHeader title="Mot de passe du Kiosk" />
      <PageBody>
        <Form>
          <Field type="password" label="Mot de passe" value={pin} onValue={setPin} />
        </Form>
      </PageBody>
    </Page>
  )
}
