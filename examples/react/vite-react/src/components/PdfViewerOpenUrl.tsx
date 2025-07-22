import { useRef, useEffect } from 'react';
import { PdfWebViewer } from '@pdf-tools/four-heights-pdf-web-viewer';

import license from '../license';

export default function PdfViewerOpenUrl() {
  const viewerContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!viewerContainer.current) {
      return;
    }

    const options = {};

    const viewer = new PdfWebViewer(viewerContainer.current, license, options);

    viewer.addEventListener('appLoaded', () => {
      fetch('./PdfWebViewer.pdf')
        .then((data) => data.blob())
        .then((blob) => {
          (blob as any).name = 'PdfWebViewer.pdf';
          viewer.open({ data: blob });
        });
    });

    return () => {
      viewer.destroy();
    };
  }, []);

  return <div ref={viewerContainer} />;
}
