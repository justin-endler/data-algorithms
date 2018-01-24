import React from 'react';

const About = () => {
  return (
    <div className="container">
      <h1>Data Structures/Algorithms</h1>

      <h2>Simple interactive demo of some data structures using React/Redux.</h2>
      <ul>
        <li>
          Traveling Salesman
          <ul>
            <li>Custom solution using the nearest neighbor algorithm once per city as the origin</li>
            <li>This improves the accuracy over a single run of NN</li>
            <li>Complexity is O(n^2), memoized down to around O(n * (n - 1))</li>
            <li>Known Issue: This implementation follows real roadways, sometimes resulting in repeated travel over a section of the tour by the salesman. This repeated travel can result in a second, unnecessary visit to a city because the algorithm is only aware of the cities as nodes in a 2-dimensional plane. To see this flaw, enter a bunch of cities in the USA west where there are less choices of roadways in general. Solving this issue will effectively create more memoization and result in better efficiency as well as potentially shorter tours.</li>
          </ul>

        </li>
        <li>
          Binary Search Tree - partial implementation of the typical BST API
        </li>
      </ul>
        <small>
          US map data is sourced from <a href="http://eric.clst.org/tech/usgeojson/" title="US map">http://eric.clst.org/tech/usgeojson/</a> which is a geoJson port of Shapefiles from <a href="https://www.census.gov/geo/maps-data/data/tiger-cart-boundary.html" title="Shapefiles">https://www.census.gov/geo/maps-data/data/tiger-cart-boundary.html</a>. US cities data is sourced from <a href="https://gist.github.com/Vudude/cee778c78694fe4183aec99693e104b1" title="US cities">https://gist.github.com/Vudude/cee778c78694fe4183aec99693e104b1</a>. Roadway data is sourced from an API endpoint provided by © OpenStreetMap contributors. This data is available under the <a href="https://opendatacommons.org/licenses/odbl/" title="Open Database Licence">https://opendatacommons.org/licenses/odbl/</a>. This project customizes some code from <a href="https://codepen.io/beaucarnes/pen/ryKvEQ?editors=0011" title="Beau Carnes">https://codepen.io/beaucarnes/pen/ryKvEQ?editors=0011</a> and it It makes use of <a href="https://github.com/facebookincubator/create-react-app" title="Create React App">https://github.com/facebookincubator/create-react-app</a>. Deployed at <a href="https://data-algorithms.herokuapp.com/" title="Data/Algorithms">https://data-algorithms.herokuapp.com/</a>.
        </small>
    </div>
  );
};

export default About;