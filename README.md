# Data Structures/Algorithms

Simple interactive demo of some data structures using React/Redux.
* Traveling Salesman
  * Custom solution using the nearest neighbor algorithm once per city as the origin
  * This improves the accuracy over a single run of NN
  * Complexity is O(n^2), memoized down to around O(n * (n - 1))
  * Known Issue: This implementation follows real roadways, sometimes resulting in repeated travel over a section of the tour by the salesman. This repeated travel can result in a second, unnecessary visit to a city because the algorithm is only aware of the cities as nodes in a 2-dimensional plane. To see this flaw, enter a bunch of cities in the USA west where there are less choices of roadways in general. Solving this issue will effectively create more memoization and result in better efficiency as well as potentially shorter tours.
* Binary Search Tree
  * Partial implementation of the typical BST API

US map data is sourced from http://eric.clst.org/tech/usgeojson/ which is a geoJson port of Shapefiles from https://www.census.gov/geo/maps-data/data/tiger-cart-boundary.html

US cities data is sourced from https://gist.github.com/Vudude/cee778c78694fe4183aec99693e104b1

Roadway data is sourced from an API endpoint provided by © OpenStreetMap contributors. This data is available under the Open Database Licence at www.openstreetmap.org/copyright

This project customizes some code from https://codepen.io/beaucarnes/pen/ryKvEQ?editors=0011.
It makes use of https://github.com/facebookincubator/create-react-app.

Deployed at https://data-algorithms.herokuapp.com/
