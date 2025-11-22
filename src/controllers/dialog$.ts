import { flux } from 'fluxio';
import { JSX } from 'preact';

export interface DialogOptions {
  id?: string;
  title: string;
  content: () => JSX.Element;
  onClose?: () => void;
}

export const dialog$ = flux<DialogOptions | null>(null);

export const showDialog = (
  title: string,
  content: () => JSX.Element,
  options?: Partial<DialogOptions>
) => {
  console.debug('showDialog', title);
  const onClose = () => dialog$.set(null);
  dialog$.set({ title, content, onClose, ...options });
};
