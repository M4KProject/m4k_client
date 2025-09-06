import { Field, Form, Page, PageBody, PageHeader } from '@common/components';
import { useMsgState } from '@common/hooks';
import {
  copyDir$,
  hasVideoMuted$,
  itemAnim$,
  itemDurationMs$,
  itemFit$,
  contentRotation$,
} from '../messages';

export const ConfigPlaylistPage = () => {
  const [copyDir, setCopyDir] = useMsgState(copyDir$);
  const [itemDurationMs, setItemDurationMs] = useMsgState(itemDurationMs$);
  const [itemFit, setItemFit] = useMsgState(itemFit$);
  const [itemAnim, setItemAnim] = useMsgState(itemAnim$);
  const [hasVideoMuted, setHasVideoMuted] = useMsgState(hasVideoMuted$);
  const [contentRotation, setContentRotation] = useMsgState(contentRotation$);

  return (
    <Page>
      <PageHeader title="Configuration" />
      <PageBody>
        <Form>
          <Field label="Copier le dossier" value={copyDir} onValue={setCopyDir} />
          <Field
            label="Durée d'affichage d'une image (ms)"
            value={itemDurationMs}
            onValue={setItemDurationMs}
          />
          <Field
            label="Mode d'affichage"
            value={itemFit}
            onValue={setItemFit}
            type="select"
            items={[
              ['contain', 'contient'],
              ['cover', 'couverture'],
              ['fill', 'remplissage'],
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
          <Field
            label="Video sans audio"
            type="switch"
            value={hasVideoMuted}
            onValue={setHasVideoMuted}
          />
          <Field
            label="Rotation du contenu"
            value={contentRotation}
            onValue={setContentRotation}
            type="select"
            items={[
              [0, '0°'],
              [90, '90°'],
              [180, '180°'],
              [270, '270°'],
            ]}
          />
        </Form>
      </PageBody>
    </Page>
  );
};
