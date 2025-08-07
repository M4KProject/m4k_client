import { Field, Form, Page, PageBody, PageHeader } from "@common/components";
import { useConfigProp } from "@/hooks/useConfigProp";

export const SitePage = () => {
  const [url, setUrl] = useConfigProp("url");
  return (
    <Page>
      <PageHeader title="Configuration du site web" />
      <PageBody>
        <Form>
          <Field label="URL" value={url} onValue={setUrl} />
        </Form>
      </PageBody>
    </Page>
  )
}
