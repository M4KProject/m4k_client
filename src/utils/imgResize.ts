import { toError, toArray } from 'fluxio';
import { clamp } from 'fluxio';
import { toImg } from './toImg';

export const imgResize = async (
  input: string | HTMLImageElement | Blob,
  minSize: number | [number, number] = 400,
  maxSize: number | [number, number] = 400,
  format: string = 'jpeg',
  quality: number = 0.9
) => {
  try {
    const img = await toImg(input);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('no ctx');

    // Convertir en tableaux [width, height]
    const min = toArray(minSize) as [number, number];
    const max = toArray(maxSize) as [number, number];

    const wMin = min[0];
    const hMin = min.length !== 2 ? min[0] : min[1];

    const wMax = max[0];
    const hMax = max.length !== 2 ? max[0] : max[1];

    // Calculer le ratio pour respecter les contraintes min/max
    let w = img.width;
    let h = img.height;
    let scale = 1;

    // D'abord, vérifier si l'image est plus petite que la taille minimale
    if (w < wMin || h < hMin) {
      const scaleW = wMin / w;
      const scaleH = hMin / h;
      scale = Math.max(scaleW, scaleH);
    }

    // Ensuite, vérifier si l'image est plus grande que la taille maximale
    if (w * scale > wMax || h * scale > hMax) {
      const scaleW = wMax / (w * scale);
      const scaleH = hMax / (h * scale);
      scale *= Math.min(scaleW, scaleH);
    }

    // Appliquer le scale final
    w = Math.round(w * scale);
    h = Math.round(h * scale);

    // S'assurer que les dimensions finales respectent les contraintes
    w = clamp(w, wMin, wMax);
    h = clamp(h, hMin, hMax);

    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(img, 0, 0, w, h);

    const dataUrl = canvas.toDataURL(`image/${format}`, quality);
    return dataUrl;
  } catch (e) {
    const error = toError(e);
    console.error('imgResize', error);
    throw error;
  }
};
