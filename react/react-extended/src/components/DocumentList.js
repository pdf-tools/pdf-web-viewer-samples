import styled, { css } from 'styled-components'

const NavigationPane = styled.div`
  background-color: #0d8ff2;
  color: #ffffff;
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  height: 68px;
  background-color: #ffffff;
  img {
    margin-left: 16px;
    height: 32px;
  }
`

const DocumentList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 0px;
`
const DocumentListItem = styled.li`
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 16px;
  cursor: pointer;

  &:hover {
    color: #b6ddfb;
  }

  ${(props) =>
    props.selected &&
    css`
      background-color: #80c8ff;
      color: #ffffff;
      &:hover {
        color: #ffffff;
      }
    `}
`

export default (props) => {
  const { documents, selectedDocument, onSelect } = props
  return (
    <NavigationPane>
      <Logo>
        <img src="./pdftools-logo.svg" alt="PDF-Tools" />
      </Logo>
      <DocumentList>
        {documents.map((doc) => (
          <DocumentListItem
            key={doc.url}
            selected={doc.url === selectedDocument}
            onClick={() => {
              onSelect(doc.url)
            }}
          >
            {doc.name}
          </DocumentListItem>
        ))}
      </DocumentList>
    </NavigationPane>
  )
}
