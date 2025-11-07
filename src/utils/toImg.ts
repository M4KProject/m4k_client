/**
 * Converts a string (URL or base64), Blob, or HTMLImageElement to a new HTMLImageElement.
 *
 * - If `value` is a `string`, it is treated as an image URL or base64-encoded image.
 * - If `value` is a `Blob`, it is converted to an object URL before loading.
 * - If `value` is an `HTMLImageElement`, a *copy* is returned (new instance with same source).
 *
 * @param value - The source of the image (string, Blob, or HTMLImageElement).
 * @returns A promise that resolves to a loaded `HTMLImageElement`.
 */
export const toImg = (value: string | Blob | HTMLImageElement): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    try {
      // Case: already an HTMLImageElement → return a copy
      if (value instanceof HTMLImageElement) {
        const copy = new Image();
        copy.src = value.src;
        copy.onload = () => resolve(copy);
        copy.onerror = reject;
        return;
      }

      // Case: Blob → convert to object URL
      if (value instanceof Blob) {
        const blobUrl = URL.createObjectURL(value);
        const img = new Image();
        img.onload = () => {
          URL.revokeObjectURL(blobUrl);
          resolve(img);
        };
        img.onerror = (err) => {
          URL.revokeObjectURL(blobUrl);
          reject(err);
        };
        img.src = blobUrl;
        return;
      }

      // Case: string → load directly, fallback to different formats
      if (typeof value === 'string') {
        const formats = ['jpeg', 'png'];
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (err?: any) => {
          const f = formats.pop();
          if (f) {
            img.src = `data:image/${f};base64,${value}`;
          } else {
            reject(err);
          }
        };
        img.src = value;
        return;
      }

      reject(new Error('Unsupported value type'));
    } catch (error) {
      reject(error);
    }
  });
};
