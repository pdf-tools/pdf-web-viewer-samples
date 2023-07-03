import { useRef, useEffect } from 'react';
import { PdfWebViewer } from '@pdf-tools/four-heights-pdf-web-viewer';

import license from '../license';

export default (props) => {
  const viewerContainer = useRef();

  useEffect(() => {
    let _viewer = new PdfWebViewer(viewerContainer.current, license);
    return () => {
      _viewer.destroy();
    };
  }, []);

  return <div ref={viewerContainer} />;
};
