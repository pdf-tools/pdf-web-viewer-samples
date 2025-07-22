import { useRef, useEffect } from 'react';
import { PdfWebViewer } from '@pdf-tools/four-heights-pdf-web-viewer';

import license from '../license';

export default function DefaultPdfViewer() {
  const viewerContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!viewerContainer.current) {
      return;
    }

    const viewer = new PdfWebViewer(viewerContainer.current, license);

    return () => {
      viewer.destroy();
    };
  }, []);

  return <div ref={viewerContainer} />;
}
