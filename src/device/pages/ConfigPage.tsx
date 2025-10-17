import { Css } from '@common/ui';
import { Form, Field, Button } from '@common/components';
import { m4k } from '@common/m4k';
import { useAsyncEffect, usePromise } from '@common/hooks';
import { toNbr } from '@common/utils/cast';
import { useState } from 'preact/hooks';
import { isNil } from '@common/utils';

const c = Css('ConfigPage', {
  '': {
    p: 1,
  },
  Actions: {
    fRow: [],
    p: 0.5,
    gap: 0.5,
  },
  'Actions .Button': {
    flex: 1,
  },
});

const useSetting = (key: string, defaultValue: any): [string, (next: string) => Promise<void>] => {
  const [value, setValue] = useState('');

  useAsyncEffect(async () => {
    const curr = await m4k.getSetting(key);
    setValue(curr);
  }, [key]);

  return [isNil(value) ? defaultValue : value, (next: string) => m4k.setSetting(key, next)];
};

const ConfigPage = () => {
  const [password, setPassword] = useSetting('password', 'yoyo');
  const [url, setUrl] = useSetting('url', '');
  const [backColor, setBackColor] = useSetting('backColor', '');
  const [copyDir, setCopyDir] = useSetting('copyDir', 'playlist');
  const [itemDuration, setItemDuration] = useSetting('itemDuration', '10s');
  const [itemFit, setItemFit] = useSetting('itemFit', 'contain');
  const [itemAnim, setItemAnim] = useSetting('itemAnim', 'rightToLeft');
  const [hasVideoMuted, setHasVideoMuted] = useSetting('hasVideoMuted', true);

  return (
    <div class={c()}>
      <Form title="Configuration Base">
        <Field
          type="password"
          name="password"
          label="Mot de passe"
          value={password}
          onValue={setPassword}
          required
        />
      </Form>

      <Form title="Configuration Page Web">
        <Field type="text" name="url" label="URL" helper="https://" value={url} onValue={setUrl} />
        <Field
          type="color"
          name="backColor"
          label="Bouton Retour Couleur"
          helper="#FF0000"
          value={backColor}
          onValue={setBackColor}
        />
      </Form>

      <Form title="Configuration Playlist">
        <Field
          type="text"
          name="copyDir"
          label="Copier le dossier"
          value={copyDir}
          onValue={setCopyDir}
        />
        <Field
          type="text"
          name="itemDuration"
          label="Durée d'affichage d'une image (en secondes)"
          value={itemDuration}
          onValue={setItemDuration}
        />
        <Field
          type="select"
          name="itemFit"
          label="Mode d'affichage des images/video"
          value={itemFit}
          onValue={setItemFit}
          items={[
            ['contain', 'contient'],
            ['cover', 'couverture'],
            ['fill', 'remplissage'],
          ]}
        />
        <Field
          type="select"
          name="itemAnim"
          label="Animation"
          value={itemAnim}
          onValue={setItemAnim}
          items={[
            ['rightToLeft', 'droite gauche'],
            ['topToBottom', 'haut bas'],
            ['fade', 'fondu'],
            ['zoom', 'zoom'],
          ]}
        />
        <Field
          type="select"
          name="hasVideoMuted"
          label="Video sans audio"
          value={hasVideoMuted}
          onValue={setHasVideoMuted}
          items={[
            ['true', 'oui'],
            ['false', 'non'],
          ]}
        />
      </Form>
    </div>
  );
};

export { ConfigPage };
