import styled, { css } from 'styled-components';

import PdfViewer from './PdfViewer';

const Tabs = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #0d8ff2;
`;

const NavList = styled.ul`
  box-sizing: border-box;
  display: flex;
  list-style: none;
  padding: 10px 0 0 0;
  margin: 0;
  overflow: auto;
  height: 68px;
  background-color: #ffffff;
  max-width: calc(100vw - 260px);
`;

const Tab = styled.li`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 4px;
  padding: 0 2px 0 4px;

  span {
    ${(props) =>
      props.selected &&
      css`
        border-color: #0d8ff2;
      `}
  }

  &:hover {
    button {
      visibility: visible;
    }
  }
`;

const TabLabel = styled.span`
  padding: 12px 5px;
  white-space: nowrap;
  border-bottom: solid 3px transparent;
`;

const CloseTabButton = styled.button`
  height: 20px;
  width: 20px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  color: #0b81da;
  cursor: pointer;
  visibility: hidden;
  svg {
    width: 18px;
    height: 18px;
    fill: currentColor;
  }
`;

const ViewerWrapper = styled.div`
  flex-grow: 1;
  position: relative;
  ${(props) =>
    !props.selected &&
    css`
      display: none;
    `}
`;

export default (props) => {
  const { openDocuments, selectedDocument, onSelect, onClose } = props;

  return (
    <Tabs>
      <NavList>
        {openDocuments.map((doc) => (
          <Tab key={doc.url} selected={doc.url === selectedDocument}>
            <TabLabel
              onClick={() => {
                onSelect(doc.url);
              }}
            >
              {doc.name}
            </TabLabel>
            <CloseTabButton
              onClick={() => {
                onClose(doc.url);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z" />
              </svg>
            </CloseTabButton>
          </Tab>
        ))}
      </NavList>
      {openDocuments.map((doc) => (
        <ViewerWrapper key={doc.url} selected={doc.url === selectedDocument}>
          <PdfViewer pdfDocument={doc} />
        </ViewerWrapper>
      ))}
    </Tabs>
  );
};
