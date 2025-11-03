import { B } from '../B';
import { DRoot } from '../D';
import { exportData } from './exportData';

const histories: DRoot[] = [];
let historyIndex: number = 0;
let historyTimer: any = null;

export const addHistory = () => {
  console.debug('addHistory');
  clearTimeout(historyTimer);
  historyTimer = setTimeout(() => {
    console.debug('addHistory cb');
    const data = exportData(B.root) as DRoot;
    histories.length = historyIndex;
    histories.push(data);
    historyIndex = histories.length;
  }, 1000);
};

export const undo = () => {
  console.debug('undo');
  historyIndex--;
  if (historyIndex >= histories.length) {
    return (historyIndex = histories.length);
  }
  if (historyIndex === histories.length - 1) {
    historyIndex--;
  }
  if (historyIndex < 0) {
    return (historyIndex = 0);
  }
  const data = histories[historyIndex];
  if (data) {
    B.importRoot(data);
    clearTimeout(historyTimer);
  }
};

export const redo = () => {
  console.debug('redo');
  historyIndex++;
  if (historyIndex < 0) {
    return (historyIndex = 0);
  }
  if (historyIndex >= histories.length) {
    return (historyIndex = histories.length);
  }
  const data = histories[historyIndex];
  if (data) {
    B.importRoot(data);
    clearTimeout(historyTimer);
  }
};
