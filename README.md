# Data Structures/Algorithms

## Simple interactive demos using React / Redux / D3.js
* Traveling Salesman
  * Custom solution using the nearest neighbor algorithm once per city as the origin
  * This improves the accuracy over a single run of NN
  * Complexity is O(n^2), memoized down to around O(n * (n - 1))
  * This implementation follows real roadways, so the path between two cities can pass through other cities. If a city is added that is already covered by an existing path, the NN algorithm is skipped and the new city is simply added to the existing tour.
* Binary Search Tree
  * Partial implementation of the typical BST API

US map data is sourced from http://eric.clst.org/tech/usgeojson/ which is a geoJson port of Shapefiles from https://www.census.gov/geo/maps-data/data/tiger-cart-boundary.html.

US cities data is sourced from https://gist.github.com/Vudude/cee778c78694fe4183aec99693e104b1.

Roadway data is sourced from an API provided by © OpenStreetMap contributors. This data is available under the Open Database Licence at www.openstreetmap.org/copyright.

This project customizes some code from https://codepen.io/beaucarnes/pen/ryKvEQ?editors=0011.
It makes use of https://github.com/facebookincubator/create-react-app.

Deployed at https://data-algorithms.herokuapp.com/
