import { Css } from 'fluxio';
import { useState } from 'preact/hooks';
import { Send, RefreshCw, FileJson } from 'lucide-react';
import { DeviceModel } from '@/api/models';
import { Field } from '@/components/fields/Field';
import { Button } from '@/components/common/Button';

const c = Css('DeviceConsole', {
  '': {
    row: 'stretch',
    w: '300px',
    bg: '#1e1e1e',
    border: '1px solid #333',
    borderRadius: '4px',
    overflow: 'hidden',
    m: 4,
  },
  Logs: {
    flex: 1,
    p: 8,
    bg: '#000',
    fg: '#0f0',
    fontFamily: 'monospace',
    overflow: 'auto',
    whiteSpace: 'pre-wrap',
  },
  Actions: {
    center: 1,
    gap: 1,
    p: 4,
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
          icon={Send}
          onClick={() => {
            onExecuteAction('sh', command.trim());
          }}
        />
        <Button
          icon={FileJson}
          onClick={() => {
            onExecuteAction('js', command.trim());
          }}
        />
        <Button icon={RefreshCw} onClick={() => onExecuteAction('refresh')} />
      </div>
    </div>
  );
};
