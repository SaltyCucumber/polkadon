import ReactDOM from 'react-dom';
import { createGlobalStyle } from 'styled-components';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'PT Mono', monospace;
  }
`;

ReactDOM.render(
  <>
    <GlobalStyle />
    <App />
  </>,
  document.getElementById('app'),
);

export * from './components/Polkadon';
