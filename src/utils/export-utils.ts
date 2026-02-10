// Utility functions for exporting diagrams in various formats

/**
 * Export SVG to PNG
 * @param svgElement - The SVG element to export
 * @param filename - The filename for the exported file
 * @param scale - The scale factor for the export (default: 2 for higher resolution)
 */
export async function exportSVGToPNG(
  svgElement: SVGElement,
  filename: string = 'diagram.png',
  scale: number = 2
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Clone and prepare SVG
      const clonedSvg = svgElement.cloneNode(true) as SVGElement;

      // Get SVG dimensions
      const bbox = (svgElement as SVGGraphicsElement).getBBox();
      const width = bbox.width || parseInt(svgElement.getAttribute('width') || '800');
      const height = bbox.height || parseInt(svgElement.getAttribute('height') || '600');

      // Set explicit dimensions
      clonedSvg.setAttribute('width', String(width));
      clonedSvg.setAttribute('height', String(height));
      clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

      // Inline styles
      const styleElement = document.createElementNS('http://www.w3.org/2000/svg', 'style');
      styleElement.textContent = `
        svg { font-family: arial, sans-serif; }
        .node rect, .node circle, .node polygon { fill: #ECECFF; stroke: #9370DB; stroke-width: 1px; }
        .edgeLabel { background-color: #e8e8e8; }
        .cluster rect { fill: #ffffde; stroke: #aaaa33; stroke-width: 1px; }
        text { font-family: arial, sans-serif; fill: #333; }
      `;
      clonedSvg.insertBefore(styleElement, clonedSvg.firstChild);

      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Failed to get canvas context');

      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.scale(scale, scale);

      // Serialize SVG
      const svgData = new XMLSerializer().serializeToString(clonedSvg);
      const encodedData = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));

      // Load into image
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        try {
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Failed to create PNG blob'));
              return;
            }

            const link = document.createElement('a');
            link.download = filename;
            link.href = URL.createObjectURL(blob);
            link.click();
            URL.revokeObjectURL(link.href);

            resolve();
          }, 'image/png');
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = () => reject(new Error('Failed to load SVG'));
      img.src = encodedData;
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Export SVG element to SVG file
 * @param svgElement - The SVG element to export
 * @param filename - The filename for the exported file
 */
export function exportSVG(svgElement: SVGElement, filename: string = 'diagram.svg'): void {
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  link.click();

  URL.revokeObjectURL(url);
}

/**
 * Export SVG to PDF using jsPDF
 * @param svgElement - The SVG element to export
 * @param filename - The filename for the exported file
 */
export async function exportSVGToPDF(
  svgElement: SVGElement,
  filename: string = 'diagram.pdf'
): Promise<void> {
  try {
    // Dynamically import jsPDF to reduce initial bundle size
    const { jsPDF } = await import('jspdf');

    // Get SVG dimensions
    const bbox = (svgElement as SVGGraphicsElement).getBBox();
    const width = bbox.width || parseInt(svgElement.getAttribute('width') || '800');
    const height = bbox.height || parseInt(svgElement.getAttribute('height') || '600');

    // First convert SVG to PNG
    const canvas = document.createElement('canvas');
    const scale = 2;
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('Failed to get canvas context');

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.scale(scale, scale);

    // Clone and prepare SVG
    const clonedSvg = svgElement.cloneNode(true) as SVGElement;
    clonedSvg.setAttribute('width', String(width));
    clonedSvg.setAttribute('height', String(height));
    clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    // Serialize SVG
    const svgData = new XMLSerializer().serializeToString(clonedSvg);
    const encodedData = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        try {
          ctx.drawImage(img, 0, 0, width, height);

          // Get image data
          const imgData = canvas.toDataURL('image/png');

          // Create PDF
          // Use portrait or landscape based on dimensions
          const orientation = width > height ? 'landscape' : 'portrait';
          const pdf = new jsPDF({
            orientation,
            unit: 'px',
            format: [width, height],
          });

          // Add image to PDF
          pdf.addImage(imgData, 'PNG', 0, 0, width, height);

          // Save PDF
          pdf.save(filename);

          resolve();
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = () => reject(new Error('Failed to load SVG'));
      img.src = encodedData;
    });
  } catch (err) {
    throw new Error('Failed to export PDF: ' + (err instanceof Error ? err.message : 'Unknown error'));
  }
}

/**
 * Get SVG element from a container
 * @param container - The container element that holds the SVG
 * @returns The SVG element or null if not found
 */
export function getSVGFromContainer(container: HTMLElement): SVGElement | null {
  return container.querySelector('svg');
}
