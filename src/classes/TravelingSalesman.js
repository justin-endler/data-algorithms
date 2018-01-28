import _ from 'lodash';
import Utility from './Utility';

export default class TravelingSalesman {
  constructor(cities, routes, usaCities) {
    this.cities = cities;
    this.routes = routes;
    this.usaCities = usaCities;
  }

  // O(n^2) with improved accuracy over NN, memoized to something like O(n * (n-1)) with larger input sets
  shortestNearestNeighbor() {
    // For each city as origin, run nearest neighbor.
    // Keep track of shortest route
    var minPathDistance = null;
    var shortestTourPath = null;

    _.each(this.cities, city => {
      const result = this.nearestNeighbor(city, minPathDistance);
      if (result && (minPathDistance === null || result.distance < minPathDistance)) {
        minPathDistance = result.distance;
        shortestTourPath = result.path;
      }
    });

    // Rotate shortest tour path to begin with 1st input city
    const originCityIndex = shortestTourPath.indexOf(this.cities[0]);
    // If it's not already the first city in the tour
    if (originCityIndex > 0) {
      shortestTourPath = shortestTourPath.slice(originCityIndex).concat(shortestTourPath.slice(0, originCityIndex));
    }

    return shortestTourPath;
  }

  // O(n) with poor accuracy
  nearestNeighbor(origin, minPathDistance, cities = this.cities, pathDistance = 0.0, path = []) {
    var citiesCopy = cities.slice();

    // Add city to path
    var pathCopy = path.slice();
    pathCopy.push(origin);

    // Remove city from cities
    _.remove(citiesCopy, city => {
      return city === origin;
    });

    // All cities accounted for. Return.
    if (!citiesCopy.length) {
      // Add on last path to complete the tour
      let routeId = Utility.getRouteId(pathCopy[0], pathCopy[pathCopy.length - 1]);
      let route = this.routes[routeId];
      if (route) {
        pathDistance += route.distance;
      }

      return {
        path: pathCopy,
        distance: pathDistance
      };
    }

    var minDistance = null;
    var nearestCity = null;
    // Get nearest neighbor
    _.each(citiesCopy, city => {
      // Avoid duplicates.
      if (origin === city) {
        return;
      }
      // Get route
      const routeId = Utility.getRouteId(origin, city);
      const route = this.routes[routeId];
      if (!route) {
        return;
      }
      if (minDistance === null || route.distance < minDistance) {
        minDistance = route.distance;
        nearestCity = city;
      }
    });

    // Increase total path distance
    pathDistance += minDistance;

    // Another nearest neighbor run has already performed this well. Bail out
    if (minPathDistance !== null && minPathDistance <= pathDistance) {
      return null;
    }

    return this.nearestNeighbor(nearestCity, minPathDistance, citiesCopy, pathDistance, pathCopy);
  }
}
