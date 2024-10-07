import styled, { createGlobalStyle } from 'styled-components';
import PdfToolsViewer from './components/PdfToolsViewer';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
`;

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
`;

export default () => {
  return (
    <Wrapper>
      <GlobalStyle />
      <PdfToolsViewer></PdfToolsViewer>
    </Wrapper>
  );
};
