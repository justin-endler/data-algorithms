import React from 'react';

const About = () => {
  return (
    <div className="container mt-3">
      <h1 className="mb-3">Data Structures/Algorithms</h1>

      <h2 className="mb-3">Simple interactive demos using React / Redux / D3.js</h2>
      <ul className="list-unstyled mb-4">
        <li className="mb-3">
          <strong>Traveling Salesman</strong>
          <ul className="pt-1">
            <li className="mb-2">Custom solution using the nearest neighbor algorithm once per city as the origin</li>
            <li className="mb-2">This improves the accuracy over a single run of NN</li>
            <li className="mb-2">Complexity is O(n^2), memoized down to around O(n * (n - 1))</li>
            <li className="mb-2">This implementation follows real roadways, so the path between two cities can pass through other cities. If a city is added that is already covered by an existing path, the NN algorithm is skipped and the new city is simply added to the existing tour.</li>
          </ul>
        </li>
        <li>
          <strong>Binary Search Tree</strong> - partial implementation of the typical BST API
        </li>
      </ul>
      <p>
        by <strong>Justin Endler</strong> - <a href="https://github.com/justin-endler/data-algorithms">github.com/justin-endler/data-algorithms</a>
      </p>
      <small>
        US map data is sourced from <a href="http://eric.clst.org/tech/usgeojson/" title="US map">eric.clst.org/tech/usgeojson</a> which is a geoJson port of Shapefiles from <a href="https://www.census.gov/geo/maps-data/data/tiger-cart-boundary.html" title="Shapefiles">www.census.gov/geo/maps-data/data/tiger-cart-boundary.html</a>. US cities data is sourced from <a href="https://gist.github.com/Vudude/cee778c78694fe4183aec99693e104b1" title="US cities">gist.github.com/Vudude/cee778c78694fe4183aec99693e104b1</a>. Roadway data is sourced from an API provided by © OpenStreetMap contributors. This data is available under the Open Database Licence at <a href="https://opendatacommons.org/licenses/odbl/" title="Open Database Licence">opendatacommons.org/licenses/odbl</a>. This project customizes some code from <a href="https://codepen.io/beaucarnes/pen/ryKvEQ?editors=0011" title="Beau Carnes">codepen.io/beaucarnes/pen/ryKvEQ</a> and it makes use of <a href="https://github.com/facebookincubator/create-react-app" title="Create React App">github.com/facebookincubator/create-react-app</a>. Deployed at <a href="https://data-algorithms.herokuapp.com/" title="Data/Algorithms">data-algorithms.herokuapp.com</a>.
      </small>
    </div>
  );
};

export default About;