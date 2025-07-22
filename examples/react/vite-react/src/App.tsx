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

const TabButton = styled.button<{ $active: boolean }>`
  border: none;
  border-bottom: solid 3px transparent;
  height: 42px;
  padding: 0 12px;
  background-color: #ffffff;
  white-space: nowrap;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f5f5f5;
  }

  ${(props) =>
    props.$active &&
    css`
      border-bottom-color: #0078d4;
      background-color: #f5f5f5;
      font-weight: 600;
    `}
`;

function App() {
  const [activeTab, setActiveTab] = useState<string>('default');

  const tabs = [
    { id: 'default', label: 'Default PDF Viewer', component: DefaultPdfViewer },
    { id: 'options', label: 'PDF Viewer Options', component: PdfViewerOptions },
    { id: 'openUrl', label: 'PDF Viewer Open URL', component: PdfViewerOpenUrl }
  ];

  const ActiveComponent = useMemo(() => {
    const tab = tabs.find((t) => t.id === activeTab);
    return tab ? tab.component : DefaultPdfViewer;
  }, [activeTab]);

  return (
    <Wrapper>
      <GlobalStyle />
      <Header>
        <Logo src="./pdftools-logo.svg" alt="PDF Tools Logo" />
        <Nav>
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              $active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </TabButton>
          ))}
        </Nav>
      </Header>
      <Viewer>
        <ActiveComponent />
      </Viewer>
    </Wrapper>
  );
}

export default App;
