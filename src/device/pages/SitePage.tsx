import { Field, Form, Page, PageBody, Toolbar } from '@common/components';
import { useMsgState } from '@common/hooks';
import { url$ } from '../messages';

export const SitePage = () => {
  const [url, setUrl] = useMsgState(url$);
  return (
    <Page>
      <Toolbar title="Configuration du site web" />
      <PageBody>
        <Form>
          <Field label="URL" value={url} onValue={setUrl} />
        </Form>
      </PageBody>
    </Page>
  );
};
