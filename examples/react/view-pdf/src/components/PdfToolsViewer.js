import { useRef, useEffect } from 'react';
import { PdfToolsViewer } from '@pdftools/pdf-web-viewer';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
`;

export default () => {
  const viewerContainer = useRef();

  useEffect(() => {
    const initPdftoolsViewer = async () => {
      const el = await PdfToolsViewer.init();
      viewerContainer.current.append(el);
    };

    initPdftoolsViewer();

    return () => {};
  }, []);

  return <Wrapper ref={viewerContainer} />;
};
