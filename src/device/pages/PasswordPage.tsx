import { Field, Form, Page, PageBody, PageHeader } from "@common/components";
import { useConfigProp } from "../hooks/useConfigProp";

export const PasswordPage = () => {
  const [password, setPassword] = useConfigProp("password");
  return (
    <Page>
      <PageHeader title="Mot de passe du Kiosk" />
      <PageBody>
        <Form>
          <Field type="password" label="Mot de passe" value={password} onValue={setPassword} />
        </Form>
      </PageBody>
    </Page>
  )
}
