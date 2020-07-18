import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import Model from './model/Model';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const model = new Model();

ReactDOM.render(
  <Provider model={model}>
    <App />
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
