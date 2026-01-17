import { useState, useEffect } from 'preact/hooks';
import { Css } from 'fluxio';
import { DownloadIcon } from 'lucide-react';
import { sortItems } from 'fluxio';
import { bridge } from '@/bridge';
import { Button } from '@/components/common/Button';
import { useApi } from '@/hooks/useApi';

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
  const url = ''; // api.applicationColl.getDownloadUrl(id, file);
  return (
    <Button
      {...c('AppButton')}
      icon={DownloadIcon}
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

const applications = [
  {
    "active": true,
    "collectionId": "pbc_2689671926",
    "collectionName": "applications",
    "created": "2025-08-21 18:18:49.597Z",
    "file": "team_viewer_host_ryiqzl4gcn.apk",
    "id": "xvoyxg6wqev64cn",
    "name": "TeamViewerHost.apk",
    "updated": "2025-10-19 17:57:14.070Z",
    "version": "15.70.848"
  },
  {
    "active": true,
    "collectionId": "pbc_2689671926",
    "collectionName": "applications",
    "created": "2025-08-21 18:19:31.849Z",
    "file": "team_viewer_qs_dfmtsn1rqd.apk",
    "id": "w8t5trdxqkqjeal",
    "name": "TeamViewerQuickSupport.apk",
    "updated": "2025-10-19 17:57:07.091Z",
    "version": "15.70.847"
  },
  {
    "active": true,
    "collectionId": "pbc_2689671926",
    "collectionName": "applications",
    "created": "2025-10-17 18:13:17.040Z",
    "file": "adbwireless_3_rcka6i3wlb.apk",
    "id": "aweinuwkr0rvjof",
    "name": "ADB Wireless",
    "updated": "2025-10-19 22:00:17.306Z",
    "version": "3"
  },
  {
    "active": true,
    "collectionId": "pbc_2689671926",
    "collectionName": "applications",
    "created": "2025-10-19 21:58:59.498Z",
    "file": "m4k_zs9ltjek4p.apk",
    "id": "i4mhh0uxuzy4y90",
    "name": "m4k.apk",
    "updated": "2025-10-19 21:59:16.842Z",
    "version": "2.2510.3"
  },
  {
    "active": true,
    "collectionId": "pbc_2689671926",
    "collectionName": "applications",
    "created": "2025-10-20 08:57:16.097Z",
    "file": "m4k_xtt0h1bizh.apk",
    "id": "5r9r0qmwgp8fjf4",
    "name": "m4k.apk",
    "updated": "2025-10-20 08:58:03.592Z",
    "version": "3.03"
  },
  {
    "active": true,
    "collectionId": "pbc_2689671926",
    "collectionName": "applications",
    "created": "2025-10-20 12:46:37.031Z",
    "file": "com_autostart_222_6899286_dd19f8ad04467e1ac3ae562a2c49fd17_jl6hlislpa.apk",
    "id": "bkrvs8z0cgf19h2",
    "name": "AutoStart.apk",
    "updated": "2025-10-20 12:46:40.336Z",
    "version": "2.2"
  }
];

export const Apps = () => {
  const api = useApi();
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    setApplications(applications);
  }, []);

  sortItems(applications, (a) => (a.name || '') + a.version);

  return (
    <div {...c('')}>
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
