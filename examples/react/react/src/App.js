import { useState, useMemo } from 'react';
import styled, { createGlobalStyle, css } from 'styled-components';

import DefaultPdfViewer from './components/DefaultPdfViewer';
import PdfViewerOptions from './components/PdfViewerOptions';
import PdfViewerOpenUrl from './components/PdfViewerOpenUrl';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
`;

const Wrapper = styled.div`
  height: 100vh;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  height: 68px;
  padding: 0 16px;
`;

const Logo = styled.img`
  height: 32px;
`;

const Viewer = styled.div`
  position: relative;
  height: calc(100vh - 68px);
`;

const Nav = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: min-content;
  grid-gap: 10px;
  margin-left: 40px;
`;

const TabButton = styled.button`
  border: none;
  border-bottom: solid 3px transparent;
  height: 42px;
  padding: 0 12px;
  background-color: #ffffff;
  white-space: nowrap;
  font-size: 16px;
  cursor: pointer;

  ${(props) =>
    props.selected &&
    css`
      background-color: #f0f0ef;
    `}
`;

export default (props) => {
  const [sample, setSample] = useState('default');
  function handleChangeSample(e) {
    setSample(e.target.name);
  }

  const viewer = useMemo(() => {
    switch (sample) {
      case 'default':
        return <DefaultPdfViewer />;
      case 'options':
        return <PdfViewerOptions />;
      case 'openUrl':
        return <PdfViewerOpenUrl />;
      default:
        return <DefaultPdfViewer />;
    }
  }, [sample]);

  return (
    <Wrapper>
      <GlobalStyle />
      <Header>
        <Logo src="./pdftools-logo.svg" />
        <Nav>
          <TabButton
            name="default"
            selected={sample === 'default'}
            onClick={handleChangeSample}
          >
            Default
          </TabButton>
          <TabButton
            name="options"
            selected={sample === 'options'}
            onClick={handleChangeSample}
          >
            Viewer Options
          </TabButton>
          <TabButton
            name="openUrl"
            selected={sample === 'openUrl'}
            onClick={handleChangeSample}
          >
            Load PDF
          </TabButton>
        </Nav>
      </Header>
      <Viewer>{viewer}</Viewer>
    </Wrapper>
  );
};
