import { useRef, useEffect } from 'react';
import {
  PdfWebViewer,
  PdfPageLayoutMode
} from '@pdf-tools/four-heights-pdf-web-viewer';

import license from '../license';

export default (props) => {
  const viewerContainer = useRef();

  useEffect(() => {
    const options = {};

    const _viewer = new PdfWebViewer(viewerContainer.current, license, options);

    _viewer.addEventListener('appLoaded', () => {
      console.log('appLoaded');
      fetch('./PdfWebViewer.pdf')
        .then((data) => data.blob())
        .then((blob) => {
          blob.name = 'PdfWebViewer.pdf';
          _viewer.open({ data: blob });
        });
    });

    return () => {
      _viewer.destroy();
    };
  }, []);

  return <div ref={viewerContainer} />;
};
