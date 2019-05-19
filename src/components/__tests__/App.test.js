import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route } from 'react-router-dom';
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

it('shows Switch component', () => {
  expect(app.find(Switch).length).toEqual(1);
});

it('shows Route component', () => {
  expect(app.find(Route).length).toBeGreaterThanOrEqual(1);
});
