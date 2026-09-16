import html2canvasPro from 'html2canvas-pro';
import { toPng } from 'html-to-image';

export interface DownloadPngOptions {
  filename: string;
  element: HTMLElement;
  scale?: number;
  backgroundColor?: string;
  onStart?: () => void;
  onSuccess?: () => void;
  onError?: (err: Error) => void;
}

export interface GeneratePngResult {
  success: boolean;
  dataUrl?: string;
  error?: Error;
}

/**
 * Triggers browser download for a Blob or DataURL.
 * Appends temporary link to DOM, sets target and download attributes,
 * handles sandbox limitations and revokes blob URLs cleanly.
 */
export function triggerFileDownload(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  a.setAttribute('download', filename);
  
  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    if (document.body.contains(a)) {
      document.body.removeChild(a);
    }
  }, 1500);
}

/**
 * Generates and downloads an HTMLElement as a high-resolution PNG image.
 * Uses html2canvas-pro (with native Tailwind v4 OKLCH support) with html-to-image fallback.
 */
export async function downloadElementAsPng({
  filename,
  element,
  scale = 2,
  backgroundColor = '#ffffff',
  onStart,
  onSuccess,
  onError
}: DownloadPngOptions): Promise<GeneratePngResult> {
  if (!element) {
    const err = new Error('No target element provided');
    onError?.(err);
    return { success: false, error: err };
  }

  onStart?.();

  // Strategy 1: html2canvas-pro (full Tailwind v4 & oklch color support)
  try {
    const canvas = await html2canvasPro(element, {
      scale: Math.max(scale, 2),
      backgroundColor: backgroundColor,
      useCORS: true,
      allowTaint: true,
      logging: false,
      ignoreElements: (el) => el.classList?.contains('no-print')
    });

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/png', 1.0);
    });

    if (blob) {
      const blobUrl = URL.createObjectURL(blob);
      triggerFileDownload(blobUrl, filename);

      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 5000);

      onSuccess?.();
      return { success: true, dataUrl: canvas.toDataURL('image/png') };
    }

    const dataUrl = canvas.toDataURL('image/png');
    triggerFileDownload(dataUrl, filename);
    onSuccess?.();
    return { success: true, dataUrl };
  } catch (proErr) {
    console.warn('html2canvas-pro rendering failed, falling back to html-to-image:', proErr);
  }

  // Strategy 2: html-to-image fallback
  try {
    const dataUrl = await toPng(element, {
      pixelRatio: Math.max(scale, 2),
      backgroundColor: backgroundColor,
      cacheBust: true,
      skipFonts: true,
      filter: (node) => {
        if (node instanceof HTMLElement && node.classList.contains('no-print')) {
          return false;
        }
        return true;
      }
    });

    triggerFileDownload(dataUrl, filename);
    onSuccess?.();
    return { success: true, dataUrl };
  } catch (fallbackErr) {
    console.error('All PNG generation strategies failed:', fallbackErr);
    const finalErr = fallbackErr instanceof Error ? fallbackErr : new Error(String(fallbackErr));
    onError?.(finalErr);
    return { success: false, error: finalErr };
  }
}
