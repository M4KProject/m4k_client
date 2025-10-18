import { Field, Form, Page, PageBody, Toolbar } from '@common/components';
import { useMsgState } from '@common/hooks';
import {
  copyDir$,
  hasVideoMuted$,
  itemAnim$,
  itemDurationMs$,
  itemFit$,
  contentRotation$,
  codePin$,
  url$,
  backColor$,
} from '../messages';
import { round } from '@common/utils';

// const useSetting = (key: string, defaultValue: any): [string, (next: string) => Promise<void>] => {
//   const [value, setValue] = useState('');
//   useAsyncEffect(async () => {
//     const curr = await m4k.getSetting(key);
//     setValue(curr);
//   }, [key]);
//   return [isNil(value) ? defaultValue : value, (next: string) => m4k.setSetting(key, next)];
// };

export const ConfigPlaylistPage = () => {
  const [codePin, setCodePin] = useMsgState(codePin$);
  const [url, setUrl] = useMsgState(url$);
  const [backColor, setBackColor] = useMsgState(backColor$);
  const [copyDir, setCopyDir] = useMsgState(copyDir$);
  const [itemDurationMs, setItemDurationMs] = useMsgState(itemDurationMs$);
  const [itemFit, setItemFit] = useMsgState(itemFit$);
  const [itemAnim, setItemAnim] = useMsgState(itemAnim$);
  const [hasVideoMuted, setHasVideoMuted] = useMsgState(hasVideoMuted$);
  const [contentRotation, setContentRotation] = useMsgState(contentRotation$);

  return (
    <Page>
      <Toolbar title="Configuration" />
      <PageBody>
        <Form title="Configuration Kiosk">
          <Field
            type="password"
            name="password"
            label="Code PIN du Kiosk"
            value={codePin}
            onValue={setCodePin}
            required
          />
          <Field label="Copier le dossier" value={copyDir} onValue={setCopyDir} />
          <Field type="text" name="url" label="URL" helper="https://" value={url} onValue={setUrl} />
        </Form>

        <Form title="Configuration Playlist">
          <Field
            type="color"
            name="backColor"
            label="Bouton Retour Couleur"
            helper="#000000ff"
            value={backColor}
            onValue={setBackColor}
          />
          <Field
            label="Durée d'affichage d'une image (en secondes)"
            value={round(itemDurationMs / 1000, 1)}
            onValue={(s) => setItemDurationMs(s * 1000)}
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
        </Form>
        
        <Form title="Configuration Video">
          <Field
            label="Video sans audio"
            type="switch"
            value={hasVideoMuted}
            onValue={setHasVideoMuted}
          />
        </Form>

        <Form title="Configuration Ecran">
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
