import { Bridge, BridgeResizeOptions } from './interfaces';
import { Fully } from './fullyInterfaces';
import { bridgeBrowser } from './bridgeBrowser';
import { imgResize } from '@/utils/imgResize';

export const bridgeFully = (bridge: Bridge, fully: Fully) => {
  bridgeBrowser(bridge, {
    // getStorage: () => fully.getStringSetting('_custom'),
    // setStorage: (json) => fully.setStringSetting('_custom', json),
    capture: async (options?: BridgeResizeOptions): Promise<string> => {
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
