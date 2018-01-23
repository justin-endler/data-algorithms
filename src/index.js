import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {
  createStore,
  applyMiddleware
} from 'redux';
import thunk from 'redux-thunk';
import { HashRouter } from 'react-router-dom';
import App from './components/App';
import reducers from './reducers';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>

  , document.getElementById('wrapper'));

registerServiceWorker();
