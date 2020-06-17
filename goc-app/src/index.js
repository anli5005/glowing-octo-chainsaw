import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createGlobalStyle } from 'styled-components';
import { AzureAD } from 'react-aad-msal';
import auth from './auth';

const GlobalStyle = createGlobalStyle`
html, body, #root {
  width: 100%;
  height: 100%;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
`;

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <AzureAD provider={auth} forceLogin>
      <App />
    </AzureAD>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();