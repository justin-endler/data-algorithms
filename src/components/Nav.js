import React from 'react';
import { NavLink } from 'react-router-dom';

const Nav = () => {
  return (
    <nav id="navigation" className="nav justify-content-center">
      <NavLink to="/" className="nav-link" activeClassName="active">About</NavLink>
      <NavLink to="/traveling-salesman" className="nav-link" activeClassName="active">Traveling Salesman</NavLink>
      <NavLink to="/binary-search-tree" className="nav-link" activeClassName="active">Binary Search Tree</NavLink>
    </nav>
  );
};

export default Nav;