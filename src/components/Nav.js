import React from 'react';
import { Link } from 'react-router-dom';

const Nav = () => {
  return (
    <nav id="navigation" className="nav justify-content-center">
      <Link to="/" className="nav-link">Home</Link>
      <Link to="/binary-search-tree" className="nav-link">Binary Search Tree</Link>
    </nav>
  );
};

export default Nav;