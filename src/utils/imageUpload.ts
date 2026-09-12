/**
 * Utility for profile picture handling:
 * - Detecting custom image data URLs / URLs
 * - Resizing images > 500KB down to 256x256 using HTML Canvas
 * - Converting to lightweight base64 JPEG data URLs for localStorage and Supabase persistence
 */

export function isCustomPhoto(avatar?: string | null): boolean {
  if (!avatar) return false;
  return (
    avatar.startsWith('data:image/') ||
    avatar.startsWith('http://') ||
    avatar.startsWith('https://') ||
    avatar.startsWith('blob:')
  );
}

/**
 * Resizes an image file to max 256x256 square crop using an HTML Canvas,
 * ensuring image stays lightweight (< 50KB) for localStorage and cloud sync.
 */
export function resizeAndEncodeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select an image file (PNG, JPG, WebP, etc.).'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read selected image file.'));
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to decode image.'));
      img.onload = () => {
        const MAX_SIZE = 256;
        
        // Setup 256x256 square canvas for avatar
        const canvas = document.createElement('canvas');
        canvas.width = MAX_SIZE;
        canvas.height = MAX_SIZE;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }

        // Center crop to a square aspect ratio
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;

        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, MAX_SIZE, MAX_SIZE);

        // Convert to compact JPEG (quality 0.85 delivers crisp avatar at ~20-35KB)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve(compressedDataUrl);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}
