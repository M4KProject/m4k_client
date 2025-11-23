import { useState, useEffect } from 'preact/hooks';
import { Css } from 'fluxio';
import { Download } from 'lucide-react';
import { sortItems } from 'fluxio';
import { bridge } from '@/bridge';
import { Button } from '@/components/common/Button';
import { ApplicationModel } from '@/api/models';
import { useApi } from '@/hooks/apiHooks';

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
    bg: 'bg',
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
  const api = useApi();
  const url = api.applicationColl.getDownloadUrl(id, file);
  return (
    <Button
      {...c('AppButton')}
      icon={Download}
      color="primary"
      onClick={(e) => {
        if (bridge.isInterface) {
          e.preventDefault();
          bridge.installApk(url);
        }
      }}
      href={url}
      link
      download={filename}
    />
  );
};

export const Apps = () => {
  const api = useApi();
  const [applications, setApplications] = useState<ApplicationModel[]>([]);

  useEffect(() => {
    api.applicationColl.all({ active: true }).then(setApplications);
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
