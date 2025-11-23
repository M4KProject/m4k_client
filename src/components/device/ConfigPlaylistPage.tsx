import {
  copyDir$,
  hasVideoMuted$,
  itemAnim$,
  itemDurationMs$,
  itemFit$,
  contentRotation$,
  codePin$,
  url$,
  bgColor$,
} from '@/controllers/deviceMessages';
import { isNil, round, toBoolean, toNumber } from 'fluxio';
import { useState } from 'preact/hooks';
import { bridge } from '@/bridge';
import { useAsyncEffect } from '@/hooks/useAsyncEffect';
import { useFluxState } from '@/hooks/useFlux';
import { Page, PageBody } from '@/components/common/Page';
import { Toolbar } from '@/components/common/Toolbar';
import { Form } from '@/components/common/Form';
import { Field } from '@/components/fields/Field';

const useSetting = (key: string): [string | null, (next: string | null) => Promise<void>] => {
  const [value, setValue] = useState<string | null>('');

  useAsyncEffect(async () => {
    const curr = await bridge.getSetting(key);
    setValue(curr);
  }, [key]);

  return [value, (next) => bridge.setSetting(key, next)];
};

const useBooleanSetting = (
  key: string,
  defVal: boolean
): [boolean, (next: boolean | null) => Promise<void>] => {
  const [value, setValue] = useSetting(key);

  return [
    toBoolean(value, defVal),
    (next) =>
      setValue(
        isNil(next) ? null
        : next ? '1'
        : '0'
      ),
  ];
};

const useNumberSetting = (
  key: string,
  defVal: number
): [number, (next: number | null) => Promise<void>] => {
  const [value, setValue] = useSetting(key);

  return [toNumber(value, defVal), (next) => setValue(isNil(next) ? null : String(next))];
};

export const ConfigPlaylistPage = () => {
  const [codePin, setCodePin] = useFluxState(codePin$);
  const [url, setUrl] = useFluxState(url$);
  const [bgColor, setBgColor] = useFluxState(bgColor$);
  const [copyDir, setCopyDir] = useFluxState(copyDir$);
  const [itemDurationMs, setItemDurationMs] = useFluxState(itemDurationMs$);
  const [itemFit, setItemFit] = useFluxState(itemFit$);
  const [itemAnim, setItemAnim] = useFluxState(itemAnim$);
  const [hasVideoMuted, setHasVideoMuted] = useFluxState(hasVideoMuted$);
  const [contentRotation, setContentRotation] = useFluxState(contentRotation$);

  const [isAutoPermissions, setIsAutoPermissions] = useBooleanSetting('isAutoPermissions', true);
  const [idleSeconds, setIdleSeconds] = useNumberSetting('idleSeconds', 600);
  const [startUrl, setStartUrl] = useSetting('startUrl');

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
          <Field
            type="text"
            name="url"
            label="URL"
            helper="https://"
            value={url}
            onValue={setUrl}
          />
        </Form>

        <Form title="Configuration Playlist">
          <Field
            type="color"
            name="bgColor"
            label="Couleur du fond"
            helper="#000000ff"
            value={bgColor}
            onValue={setBgColor}
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

        <Form title="Autres">
          <Field
            label="Permissions au démarrage"
            type="switch"
            value={isAutoPermissions}
            onValue={setIsAutoPermissions}
          />
          <Field
            label="Délai d'inactivité (secondes)"
            type="number"
            value={idleSeconds}
            onValue={setIdleSeconds}
          />
          <Field label="URL de l'application" type="text" value={startUrl} onValue={setStartUrl} />
        </Form>
      </PageBody>
    </Page>
  );
};
