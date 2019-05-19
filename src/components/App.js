import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Nav from 'components/Nav';
import About from 'components/About';
import TravelingSalesmanComponent from 'components/TravelingSalesmanComponent';
import BinarySearchTreeComponent from 'components/BinarySearchTreeComponent';

export default class App extends Component {
  render() {
    return (
      <div>
        <Nav />
        <main>
          <Switch>
            <Route exact path='/' component={About} />
            <Route exact path='/traveling-salesman' component={TravelingSalesmanComponent} />
            <Route exact path='/binary-search-tree' component={BinarySearchTreeComponent} />
          </Switch>
        </main>
      </div>
    );
  }
}
