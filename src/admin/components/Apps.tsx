import { useState, useEffect } from 'preact/hooks';
import { Css, updateUrlParams } from '@common/ui';
import { AuthForm, Button } from '@common/components';
import { Download } from 'lucide-react';
import { applicationsColl } from '../../api/sync';
import { ApplicationModel } from '@common/api';
import { sortItems } from '@common/utils';
import { m4k } from '@common/m4k';

const c = Css('Apps', {
  '': {
    fRow: ['center', 'center'],
    flexWrap: 'wrap',
    overflow: 'auto',
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

export const AppButton = ({
  id,
  file,
  filename,
}: {
  id: string;
  file: string;
  filename: string;
}) => {
  const url = applicationsColl.getDownloadUrl(id, file);
  return (
    <Button
      class={c('AppButton')}
      icon={<Download />}
      color="primary"
      onClick={(e) => {
        if (m4k.isInterface) {
          e.preventDefault();
          m4k.installApk(url);
        }
      }}
      href={url}
      link
      download={filename}
    />
  );
};

export const Apps = () => {
  const [applications, setApplications] = useState<ApplicationModel[]>([]);

  useEffect(() => {
    applicationsColl.all({ where: { active: true } }).then(setApplications);
  }, []);

  sortItems(applications, (a) => (a.name || '') + a.version);

  return (
    <div class={c('')}>
      {applications.map((app) => (
        <div key={app.id} class={c('App')}>
          <div class={c('AppInfo')}>
            <div class={c('AppName')}>{app.name}</div>
            {app.version && <div class={c('AppVersion')}>Version: {app.version}</div>}
          </div>
          <AppButton id={app.id} file={String(app.file)} filename={app.name || ''} />
        </div>
      ))}
    </div>
  );
};
