import { Css, flexRow, flexColumn } from '@common/ui';

import { Button, Field } from '@common/components';
import { DeviceModel } from '@common/api';
import { useState } from 'preact/hooks';
import { Send, RefreshCw, FileJson } from 'lucide-react';

const c = Css('DeviceConsole', {
  '': {
    ...flexColumn({ align: 'stretch' }),
    w: '300px',
    bg: '#1e1e1e',
    border: '1px solid #333',
    borderRadius: '4px',
    overflow: 'hidden',
    m: 0.5,
  },
  Logs: {
    flex: 1,
    p: 1,
    bg: '#000',
    fg: '#0f0',
    fontFamily: 'monospace',
    fontSize: '12px',
    overflow: 'auto',
    whiteSpace: 'pre-wrap',
  },
  Actions: {
    ...flexRow({ justify: 'center', align: 'center' }),
    gap: 1,
    p: 0.5,
  },
});

interface DeviceConsoleProps {
  device: DeviceModel;
  consoleOutput: string;
  onExecuteAction: (action: string, input?: any) => Promise<void>;
}

export const DeviceConsole = ({ consoleOutput, onExecuteAction }: DeviceConsoleProps) => {
  const [command, setCommand] = useState('');

  return (
    <div class={c()}>
      <div class={c('Logs')}>{consoleOutput}</div>
      <div class={c('Actions')}>
        <Field type="text" value={command} onValue={setCommand} />
        <Button
          icon={<Send />}
          onClick={() => {
            onExecuteAction('sh', command.trim());
          }}
        />
        <Button
          icon={<FileJson />}
          onClick={() => {
            onExecuteAction('js', command.trim());
          }}
        />
        <Button icon={<RefreshCw />} onClick={() => onExecuteAction('refresh')} />
      </div>
    </div>
  );
};
