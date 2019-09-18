import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyle = createGlobalStyle`
  ${reset}

  html {
    font-size: 625%;
  }

  body {
    font-size: .16rem;
    color: white;
    // background: #333;
  }

  .mg-r-10 {
    margin-right: 10px
  }
  .mg-b-30 {
    margin-bottom: 30px
  }
`
export default GlobalStyle;

