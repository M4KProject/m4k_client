import { Css, autoScrollEnd } from 'fluxio';
import { dialog$ } from '@/controllers/dialog$';
import { useEffect, useRef } from 'preact/hooks';
import { flux } from 'fluxio';
import { useFlux } from '@/hooks/useFlux';
import { Progress } from '@/components/Progress';

const c = Css('ProgressView', {
  '': {
    col: 'stretch',
    bg: 'bg',
  },
  Logs: {
    col: 1,
    overflow: 'auto',
    hMin: 60,
    hMax: 60,
    border: `1px solid black`,
    mt: 8,
    p: 4,
    rounded: 3,
  },
  ' .m4kLog-debug': { fg: 'default' },
  ' .m4kLog-info': { fg: 'info' },
  ' .m4kLog-warn': { fg: 'warn' },
  ' .m4kLog-error': { fg: 'error' },
});

export interface ProgressData {
  id: string;
  title: string;
  value: number;
  logs: ['debug' | 'info' | 'warn' | 'error', string][];
}

const progress$ = flux<ProgressData | null>(null);

progress$.on((progress) => {
  if (progress && dialog$.get()?.id !== progress.id) {
    dialog$.set({
      id: 'progress',
      title: progress.title,
      content: ProgressView,
    });
  }
});

progress$.debounce(10000).on(() => {
  if (dialog$.get()?.id === 'progress') {
    dialog$.set(null);
  }
});

const ProgressView = () => {
  const logsRef = useRef<HTMLDivElement>(null);
  const progress = useFlux(progress$);
  const value = progress?.value || 0;
  const logs = progress?.logs || [];
  const step = logs[logs.length - 1];

  useEffect(() => autoScrollEnd(logsRef.current), [logs]);

  return (
    <div {...c()}>
      <Progress progress={value * 100} step={step ? step[1] : ''} />
      <div ref={logsRef} {...c('Logs')}>
        {logs.map((log, i) => (
          <div key={i + log[1]} className={`m4kLog-${log[0]}`}>
            {log[1]}
          </div>
        ))}
      </div>
    </div>
  );
};

let _progId = 0;
export const newProgressDialog = (title: string) => {
  const data: ProgressData = { title, value: 0, logs: [], id: String(_progId++) };
  return (value: number, level: 'debug' | 'info' | 'warn' | 'error', text: string) => {
    data.value = value;
    data.logs.push([level, text]);
    if (data.logs.length > 100) data.logs.splice(0, 20);
    progress$.set({ ...data });
  };
};
