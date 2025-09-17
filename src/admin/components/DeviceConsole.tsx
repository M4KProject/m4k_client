import { Css, flexRow, flexColumn } from '@common/ui';
import { stringify } from '@common/utils';
import { useCss } from '@common/hooks';
import { Div, Button, Field } from '@common/components';
import { DeviceModel } from '@common/api/models';
import { useState } from 'preact/hooks';
import { Send, RefreshCw } from 'lucide-react';

const css: Css = {
  '&': {
    ...flexColumn({ align: 'stretch' }),
    w: '300px',
    bg: '#1e1e1e',
    border: '1px solid #333',
    borderRadius: '4px',
    overflow: 'hidden',
    m: 0.5,
  },
  '&Logs': {
    flex: 1,
    p: 1,
    bg: '#000',
    fg: '#0f0',
    fontFamily: 'monospace',
    fontSize: '12px',
    overflow: 'auto',
    whiteSpace: 'pre-wrap',
  },
  '&Actions': {
    ...flexRow({ justify: 'center', align: 'center' }),
    gap: 1,
    p: 0.5,
  },
};

interface DeviceConsoleProps {
  device: DeviceModel;
  consoleOutput: string;
  onExecuteAction: (action: string, input?: any) => Promise<void>;
  onSendCommand: (command: string) => Promise<void>;
}

export const DeviceConsole = ({
  device,
  consoleOutput,
  onExecuteAction,
  onSendCommand,
}: DeviceConsoleProps) => {
  const c = useCss('DeviceConsole', css);
  const [command, setCommand] = useState('');

  const handleSendCommand = async () => {
    if (!command.trim()) return;
    await onSendCommand(command);
    // setCommand(''); // Uncomment if you want to clear after sending
  };

  return (
    <Div cls={c}>
      <Div cls={`${c}Logs`}>
        {consoleOutput}
        {device.result && `${stringify(device.result, null, 2)}\n`}
      </Div>
      <Div cls={`${c}Actions`}>
        <Field type="text" value={command} onValue={setCommand} />
        <Button icon={<Send />} onClick={handleSendCommand} />
        <Button icon={<RefreshCw />} onClick={() => onExecuteAction('refresh')} />
      </Div>
    </Div>
  );
};
