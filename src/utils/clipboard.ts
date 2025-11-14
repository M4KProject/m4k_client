import { getStorage, logger } from 'fluxio';
import { jsonStringify, jsonParse } from 'fluxio';

const log = logger('clipboard');

export const clipboardCopy = async (value: any): Promise<void> => {
  try {
    log.d('copy', value);
    getStorage().set('clipboard', value);
    const json = jsonStringify(value);
    await navigator.clipboard.writeText(json);
  } catch (e) {
    log.w('copy error', e);
  }
};

export const clipboardPaste = async () => {
  try {
    log.d('paste');
    const json = await navigator.clipboard.readText();
    const value = jsonParse(json) || json;
    log.d('paste value', json, value);
    return value;
  } catch (e) {
    log.w('paste error', e);
    return getStorage().get('clipboard', undefined);
  }
};
