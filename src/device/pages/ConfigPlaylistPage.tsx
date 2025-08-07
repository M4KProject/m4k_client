import { Field, Form, Page, PageBody, PageHeader } from "@common/components";
import { useConfigProp } from "../hooks/useConfigProp";

export const ConfigPlaylistPage = () => {
  const [copyDir, setCopyDir] = useConfigProp("copyDir");
  const [itemDurationMs, setItemDurationMs] = useConfigProp("itemDurationMs");
  const [itemFit, setItemFit] = useConfigProp("itemFit");
  const [itemAnim, setItemAnim] = useConfigProp("itemAnim");
  const [hasVideoMuted, setHasVideoMuted] = useConfigProp("hasVideoMuted");

  return (
    <Page>
      <PageHeader title="Configuration de la Playlist" />
      <PageBody>
        <Form>
          <Field label="Copier le dossier" value={copyDir} onValue={setCopyDir} />
          <Field label="Durée d'affichage d'une image (ms)" value={itemDurationMs} onValue={setItemDurationMs} />
          <Field
            label="Mode d'affichage"
            value={itemFit}
            onValue={setItemFit}
            type="select"
            items={[
              ["contain", "contient"],
              ["cover", "couverture"],
              ["fill", "remplissage"],
            ]}
          />
          <Field
            label="Animation"
            value={itemAnim}
            onValue={setItemAnim}
            type="select"
            items={[
              ['rightToLeft', 'droite gauche'],
              ['topToBottom', 'haut bas'],
              ['fade', 'fondu'],
              ['zoom', 'zoom'],
            ]}
          />
          <Field label="Video sans audio" type="switch" value={hasVideoMuted} onValue={setHasVideoMuted} />
        </Form>
      </PageBody>
    </Page>
  )
}
