import React, { Component } from 'react';

import { NavLink } from 'react-router-dom';

const handleClick = Symbol('handleClick');

class Nav extends Component {

  [handleClick](event) {
    const navLink = this;
    if (navLink.className && navLink.className.indexOf('active') > -1) {
      event.preventDefault()
    }
  }

  render() {
    return (
      <nav id="navigation" className="nav justify-content-center">
        <NavLink to="/" className="nav-link" activeClassName="active">About</NavLink>
        <NavLink to="/traveling-salesman" className="nav-link" activeClassName="active" onClick={this[handleClick]}>Traveling Salesman</NavLink>
        <NavLink to="/binary-search-tree" className="nav-link" activeClassName="active" onClick={this[handleClick]}>Binary Search Tree</NavLink>
      </nav>
    );
  }
}

export default Nav;