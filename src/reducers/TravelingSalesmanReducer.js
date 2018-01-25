import _ from 'lodash';
import Utility from '../classes/Utility';

import TravelingSalesmanComponent from '../components/TravelingSalesmanComponent';
import TravelingSalesman from '../classes/TravelingSalesman';

import {
  ADD_TRAVELING_SALESMAN_CITY,
  GET_NEW_TRAVELING_SALESMAN_ROUTES,
  MOVE_TRAVELING_SALESMAN_MARKER,
  UPDATE_TRAVELING_SALESMAN_MARKER_POINTS
} from '../actions';
import usaCities from '../data/usa-cities';

const coordinateSampleRate = 8;

var selectedCities = {
  type: 'FeatureCollection',
  features: []
};

export const TravelingSalesmanReducer = (state, action) => {
  switch(action.type) {
    case ADD_TRAVELING_SALESMAN_CITY:
      return reduceAddTravelingSalesmanCity(state, action);
    case GET_NEW_TRAVELING_SALESMAN_ROUTES:
      return reduceGetNewTravelingSalesmanRoutes(state, action);
    default:
      state = state || {
        cities: [],
        routes: {},
        shortestTourPath: [],
        citiesInRoutes: [],
        suggestions: getSuggestions([]),
        selectedCities
      };
      return state;
  }
};

export const TravelingSalesmanMarkerReducer = (state, action) => {
  switch(action.type) {
    case MOVE_TRAVELING_SALESMAN_MARKER:
      let markerIndex = (state.markerIndex || 0) + coordinateSampleRate;
      if (markerIndex >= state.points.length) {
        markerIndex = coordinateSampleRate;
      }
      return Object.assign({}, state, {
        markerIndex
      });
    case UPDATE_TRAVELING_SALESMAN_MARKER_POINTS:
      return Object.assign({}, state, {
        points: action.payload.points
      });
    default:
      return state || {
        markerIndex: coordinateSampleRate,
        points: []
      };
  }
};

const reduceAddTravelingSalesmanCity = (state, action) => {
  // Validate new city
  const newCityFeature = _.find(usaCities.features, feature => {
    return action.payload.city === TravelingSalesmanComponent.getCityName(feature);
  });
  if (!newCityFeature) {
    return state;
  }
  const newCity = TravelingSalesmanComponent.getCityName(newCityFeature);

  // Add the city
  var cities = state.cities.slice();
  cities.push(action.payload.city);

  // Update suggestions
  const suggestions = getSuggestions(cities);

  // Fill out getJson data for selected cities
  selectedCities.features = cities.map(city => {
    // Use the new city feature as a memo for a little bit of savings
    if (city === newCity) {
      return newCityFeature;
    }
    // Get the geoJson feature of the city
    return _.find(usaCities.features, feature => {
      return city === TravelingSalesmanComponent.getCityName(feature);
    });
  }).filter(Boolean);

  return Object.assign({}, state, {
    cities,
    suggestions,
    selectedCities
  });
};

// ported from https://gist.github.com/moshmage/2ae02baa14d10bd6092424dcef5a1186
const cityWithinRadius = (city, point, kilometers) => {
  const earthRadius = 6371;
  const latitudeDifference = getRadians(point[1] - city[1]);
  const longitudeDifference = getRadians(point[0] - city[0]);
  const y = Math.sin(latitudeDifference/2);
  const x = Math.sin(longitudeDifference/2);
  const a = y * y + Math.cos(getRadians(city[1])) * Math.cos(getRadians(point[1])) * x * x;
  const c = 2 * Math.asin(Math.sqrt(a));
  const proximity = earthRadius * c;

  return proximity <= kilometers;
};

const getRadians = (degrees) => {
  return Math.tan(degrees * (Math.PI/180));
};

const reduceGetNewTravelingSalesmanRoutes = (state, action) => {
  const { newRoutes } = action.payload;

  // Add geoJson data to each new route
  _.forOwn(newRoutes, osmToGeoJson);

  const routes = Object.assign({}, state.routes, newRoutes);

  // Is this city already covered by an existing route?
  var alreadyCovered = false;
  var shortestTourPath;
  const newCity = _.difference(state.cities, state.shortestTourPath)[0];
  if (newCity) {
    let [
      newCityName,
      newCityState
    ] = newCity.split(',');

    let newCityCoordinates = Utility.findValue(usaCities, 'features', []).find(feature => {
      return feature.properties.city === newCityName.trim() && feature.properties.state === newCityState.trim();
    }).geometry.coordinates;

    _.each(state.shortestTourPath, (currentCity, index) => {
      var nextCity = state.shortestTourPath[index + 1];
      if (!nextCity) {
        nextCity = state.shortestTourPath[0];
      }

      const routeId = Utility.getRouteId(currentCity, nextCity);
      const route = routes[routeId];
      const coordinates = Utility.findValue(route, 'geoJson.geometry.coordinates', []);
      _.each(coordinates, pair => {
        if (cityWithinRadius(pair, newCityCoordinates, 10)) {
          alreadyCovered = true;
          shortestTourPath = state.shortestTourPath.slice();
          let nextCityIndex = shortestTourPath.indexOf(nextCity);
          if (nextCityIndex === 0) {
            shortestTourPath.push(newCity);
          } else {
            shortestTourPath.splice(nextCityIndex, 0, newCity);
          }
          return false;
        }
      });
      return !alreadyCovered;
    });
  }

  if (!alreadyCovered) {
    let travelingSalesman = new TravelingSalesman(state.cities, routes, usaCities);
    shortestTourPath = travelingSalesman.shortestNearestNeighbor();
  }

  return Object.assign({}, state, {
    routes,
    shortestTourPath,
    citiesInRoutes: state.cities
  });
};

const getSuggestions = cities => {
  // Re-collect suggestions to avoid duplicating city choices
  var suggestions = [];
  usaCities.features.forEach(feature => {
    const city = TravelingSalesmanComponent.getCityName(feature);
    if (cities.indexOf(city) === -1) {
      suggestions.push(city);
    }
  });
  return suggestions;
};

const osmToGeoJson = (newRoute) => {
  const routes = Utility.findValue(newRoute, 'response.data.routes', []);
  if (!routes.length) {
    return null;
  }
  // Establish basic geoJson object
  const geoJson = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString'
    }
  };
  // Use the shortest route
  const route = _.minBy(routes, 'distance');
  // Store distance for easy access
  newRoute.distance = route.distance;
  const steps = Utility.findValue(route, 'legs.0.steps', []);
  if (!steps.length) {
    return null;
  }
  // Populate line coordinates
  geoJson.geometry.coordinates = [];
  steps.forEach(step => {
    const intersections = step.intersections || [];
    intersections.forEach(intersection => {
      geoJson.geometry.coordinates.push(intersection.location);
    });
  });
  newRoute.geoJson = geoJson;
};
