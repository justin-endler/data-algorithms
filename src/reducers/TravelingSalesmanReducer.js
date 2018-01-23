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

// @todo implement removal of a city
// @todo add disclaimer about accounting for cities already handled by a route until it's solved
// @todo guard agaist the intermittent geoJson bug, rarely happens


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
      let markerIndex = (state.markerIndex || 0) + 3;
      if (markerIndex >= state.points.length) {
        markerIndex = 3;
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
        markerIndex: 3,
        points: []
      };
  }
};

// @todo add a little writeup explanation for the user
// @todo publish the total miles of the route
// @todo style some more

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
}

const reduceGetNewTravelingSalesmanRoutes = (state, action) => {
  const { newRoutes } = action.payload;

  // Add geoJson data to each new route
  _.forOwn(newRoutes, osmToGeoJson);

  const routes = Object.assign({}, state.routes, newRoutes);
  const travelingSalesman = new TravelingSalesman(state.cities, routes);
  const shortestTourPath = travelingSalesman.shortestNearestNeighbor();

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
