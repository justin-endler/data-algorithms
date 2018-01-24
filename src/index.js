import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { MemoryRouter } from 'react-router-dom';
import App from './components/App';
import reducers from './reducers';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

const createStoreWithMiddleware = applyMiddleware()(createStore);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <MemoryRouter>
      <App />
    </MemoryRouter>
  </Provider>

  , document.getElementById('wrapper'));

registerServiceWorker();
