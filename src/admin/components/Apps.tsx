import { useState, useEffect } from 'preact/hooks';
import { Css } from 'fluxio';
import { Button } from '@common/components';
import { Download } from 'lucide-react';
import { ApplicationModel, applicationColl } from '@/api';
import { sortItems } from 'fluxio';
import { m4k } from '@common/m4k';

const c = Css('Apps', {
  '': {
    row: ['center', 'center'],
    flexWrap: 'wrap',
    overflow: 'auto',
  },
  App: {
    row: ['center', 'between'],
    m: 4,
    p: 4,
    bg: 'b1',
    rounded: 5,
  },
  AppInfo: {
    col: 1,
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
  const url = applicationColl.getDownloadUrl(id, file);
  return (
    <Button
      {...c('AppButton')}
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
    applicationColl.all({ active: true }).then(setApplications);
  }, []);

  sortItems(applications, (a) => (a.name || '') + a.version);

  return (
    <div {...c()}>
      {applications.map((app) => (
        <div key={app.id} {...c('App')}>
          <div {...c('AppInfo')}>
            <div {...c('AppName')}>{app.name}</div>
            {app.version && <div {...c('AppVersion')}>Version: {app.version}</div>}
          </div>
          <AppButton id={app.id} file={String(app.file)} filename={app.name || ''} />
        </div>
      ))}
    </div>
  );
};
