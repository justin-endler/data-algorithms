import React, { Component } from 'react';
import Nav from './Nav';
import { Switch, Route } from 'react-router-dom';
import BinarySearchTreeComponent from './BinarySearchTreeComponent';
import About from './About';
import TravelingSalesmanComponent from './TravelingSalesmanComponent';

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
