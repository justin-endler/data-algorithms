import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';

import App from 'components/App';
import Nav from 'components/Nav';

let app;

beforeEach(() => {
  app = shallow(<App />);
});

it('shows Nav component', () => {
  expect(app.find(Nav).length).toEqual(1);
});
