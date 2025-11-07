import { M4Kiosk, M4kResizeOptions } from './m4kInterface';
import { Fully } from './fullyInterfaces';
import { m4kBase } from './m4kBase';
import { imgResize } from '@/utils/imgResize';

export const m4kFully = (m4k: M4Kiosk, fully: Fully) => {
  m4kBase(m4k, {
    // getStorage: () => fully.getStringSetting('_custom'),
    // setStorage: (json) => fully.setStringSetting('_custom', json),
    capture: async (options?: M4kResizeOptions): Promise<string> => {
      const imgBase64 = fully.getScreenshotPngBase64();
      const dataUrl = await imgResize(
        imgBase64,
        options?.min,
        options?.max,
        options?.format,
        options?.quality
      );
      return dataUrl;
    },
  });
};
