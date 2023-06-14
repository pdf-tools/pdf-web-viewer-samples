import styled, { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Source Sans Pro';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url(https://fonts.gstatic.com/s/sourcesanspro/v21/6xK3dSBYKcSV-LCoeQqfX1RYOo3qOK7l.woff2)
      format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F,
      U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }
  *,
  ::before,
  ::after {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    font-size: 16px;
    font-weight: 400;
    font-family: 'Source Sans Pro', sans-serif;
    line-height: 1.5;
  }
`

const Layout = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr;
  height: 100vh;
`

export default (props) => {
  const { children } = props
  return (
    <>
      <GlobalStyle />
      <Layout>{children}</Layout>
    </>
  )
}
