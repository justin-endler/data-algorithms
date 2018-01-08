import React, { Component } from 'react';
import Nav from './Nav';
import { Switch, Route } from 'react-router-dom';
import BinarySearchTreeComponent from './BinarySearchTreeComponent';

export default class App extends Component {
  render() {
    return (
      <div>
        <Nav />
        <main>
          <Switch>
            <Route exact path='/binary-search-tree' component={BinarySearchTreeComponent} />
          </Switch>
        </main>
      </div>
    );
  }
}
