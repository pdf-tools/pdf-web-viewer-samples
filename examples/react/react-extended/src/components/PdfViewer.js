import { useRef, useEffect } from 'react';
import { PdfWebViewer } from '@pdftools/four-heights-pdf-web-viewer';

import license from '../license';

const options = {
  viewer: {
    permissions: {
      allowFileDrop: false,
      allowOpenFile: false
    }
  }
};

export default (props) => {
  const { pdfDocument } = props;
  const viewerContainer = useRef();

  useEffect(() => {
    const _viewer = new PdfWebViewer(viewerContainer.current, license, options);
    _viewer.addEventListener('appLoaded', () => {
      _viewer.open({ uri: pdfDocument.url });
    });
    return () => {
      _viewer.destroy();
    };
  }, []);

  return <div ref={viewerContainer} />;
};
