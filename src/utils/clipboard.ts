import { toError } from 'fluxio';
import { jsonStringify, jsonParse } from 'fluxio';

export const clipboardCopy = async (value: any): Promise<void> => {
  console.debug('clipboardCopy');
  localStorage.setItem('__copy', value);
  try {
    await navigator.clipboard.writeText(jsonStringify(value) || '');
  } catch (e) {
    const error = toError(e);
    console.warn('clipboardCopy error', error);
  }
};

export const clipboardPaste = async () => {
  try {
    console.debug('clipboardPaste');
    const json = await navigator.clipboard.readText();
    if (typeof json === 'string') return jsonParse(json) || json;
    return json;
  } catch (e) {
    const error = toError(e);
    console.warn('clipboardPaste error', error);
    return Promise.resolve(localStorage.getItem('__copy'));
  }
};
