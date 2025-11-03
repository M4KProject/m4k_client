import { Css } from 'fluxio';
import { Button, Field } from '@common/components';
import { DeviceModel } from '@/api';
import { useState } from 'preact/hooks';
import { Send, RefreshCw, FileJson } from 'lucide-react';

const c = Css('DeviceConsole', {
  '': {
    fRow: 'stretch',
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
    overflow: 'auto',
    whiteSpace: 'pre-wrap',
  },
  Actions: {
    fCenter: 1,
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
    <div {...c()}>
      <div {...c('Logs')}>{consoleOutput}</div>
      <div {...c('Actions')}>
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
