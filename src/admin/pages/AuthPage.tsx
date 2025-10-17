import { useState, useEffect } from 'preact/hooks';
import { Css } from '@common/ui';
import { AuthForm, Button } from '@common/components';
import logoUrl from '../assets/logo.svg';
import loginUrl from '../assets/login.svg';
import { Download } from 'lucide-react';
import { applicationsColl } from '../../api/sync';
import { ApplicationModel } from '@common/api';
import { sortItems } from '@common/utils';

const c = Css('AuthPage', {
  '': {
    fRow: 'stretch',
    position: 'fixed',
    overflow: 'auto',
    fg: 't2',
    bg: 'b2',
    inset: 0,
  },
  Content: {
    fCol: ['center', 'space-around'],
    flex: 1,
    textAlign: 'center',
  },
  Logo: {
    bgUrl: logoUrl,
    bgMode: 'contain',
    w: 20,
    h: 5,
  },
  Title: {
    m: 0,
    p: 0,
    fontWeight: 500,
    fg: 'p50',
  },
  Illu: {
    bgUrl: loginUrl,
    bgMode: 'contain',
    h: 15,
    w: 30,
  },
  ' &DownloadButton': {
    position: 'fixed',
    b: 1,
    l: 1,
    opacity: 0.7,
  },
  Apps: {
    fRow: ['center', 'center'],
    flexWrap: 'wrap',
    overflow: 'auto',
    wh: '100%',
  },
  App: {
    fRow: ['center', 'space-between'],
    m: 0.5,
    p: 0.5,
    bg: 'b1',
    rounded: 2,
  },
  AppInfo: {
    fCol: [],
  },
  AppName: {
    bold: 1,
  },
  AppVersion: {
    opacity: 0.7,
  },
  AppButton: {},
});

export const AuthPage = () => {
  const [showApplications, setShowApplications] = useState(false);
  const [applications, setApplications] = useState<ApplicationModel[]>([]);

  useEffect(() => {
    if (showApplications) {
      applicationsColl.all().then(setApplications);
    }
  }, [showApplications]);

  const handleDownload = (app: ApplicationModel) => {
    if (app.file) {
      const fileUrl = applicationsColl.getUrl(app.id, app.file);
      window.open(fileUrl, '_blank');
    }
  };

  return (
    <div class={c()}>
      <div class={c('Content')}>
        <div class={c('Logo')} />
        {!showApplications ? (
          <>
            <div class={c('Title')}>
              PLV DIGITALE - BORNES ET ECRANS INTERACTIFS - CONTENUS NUMERIQUES
            </div>
            <div class={c('Illu')} />
          </>
        ) : (
          <div class={c('Apps')}>
            {sortItems(applications, (a) => (a.name || '') + a.version).map((app) => (
              <div key={app.id} class={c('App')}>
                <div class={c('AppInfo')}>
                  <div class={c('AppName')}>{app.name}</div>
                  {app.version && <div class={c('AppVersion')}>Version: {app.version}</div>}
                </div>
                <Button
                  class={c('AppButton')}
                  icon={<Download />}
                  color="primary"
                  onClick={() => handleDownload(app)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <AuthForm />
      <Button
        icon={<Download />}
        class={c('DownloadButton')}
        color="secondary"
        onClick={() => setShowApplications(!showApplications)}
        title="Téléchargement"
      />
    </div>
  );
};
