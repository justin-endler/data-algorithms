import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as d3 from 'd3';
import Utility from 'classes/Utility';

import GeoPath from 'components/GeoPath';
import InputWithSuggestions from 'components/InputWithSuggestions';
import TravelingSalesmanMarker, { encodePathId } from 'components/TravelingSalesmanMarker';

import 'css/TravelingSalesman.css';

import {
  addTravelingSalesmanCity,
  removeTravelingSalesmanCity,
  getNewTravelingSalesmanRoutes
} from 'actions';

import usaStatesBoundary from 'data/usa-states-boundary';

import * as config from 'config.json';

// configure to show the USA lower 48
const { usaMap } = config;
const width = usaMap.width;
const height = usaMap.height;

var geoPathPlacementSettings = usaMap.geoPathPlacementSettings;
geoPathPlacementSettings.translate = [width/2, height/2];

const addRouteObject = Symbol('addRouteObject');

class TravelingSalesmanComponent extends Component {
  constructor(props) {
    super(props);

    this.activeRoutes = [];

    this.handleCityClick = this.handleCityClick.bind(this);
  }

  componentDidUpdate() {
    const {
      cities,
      routes,
      citiesInRoutes,
      selectedCities
     } = this.props;

    // Avoid calculating new routes if cities are all accounted for
    if (cities.toString() === citiesInRoutes.toString()) {
      return;
    }

    var newRoutes = {};
    for (let i = 0; i < selectedCities.length; i++) {
      for (let j = i; j < selectedCities.length; j++) {
        let feature1 = selectedCities[i];
        let feature2 = selectedCities[j];

        this[addRouteObject](feature1, feature2, routes, newRoutes);
      }
    }

    if (!cities.length) {
      return;
    }

    this.props.getNewTravelingSalesmanRoutes(newRoutes);
  }

  [addRouteObject](feature1, feature2, routes, newRoutes) {
    // Use consistent order for comparison
    const [fromFeature, toFeature] = _.sortBy([feature1, feature2], feature => {
      return TravelingSalesmanComponent.getCityName(feature);
    });

    const fromCity = TravelingSalesmanComponent.getCityName(fromFeature);
    const toCity = TravelingSalesmanComponent.getCityName(toFeature);

    // Avoid considering a city routing to itself
    if (fromCity === toCity) {
      return;
    }

    const routeId = `${fromCity};${toCity}`;
    // Route not already accounted for
    if (!routes[routeId]) {
      newRoutes[routeId] = {
        from: {
          city: fromCity,
          coordinates: fromFeature.geometry.coordinates
        },
        to: {
          city: toCity,
          coordinates: toFeature.geometry.coordinates
        },
      };
    }
  }

  handleCityClick(event, props, state) {
    const cityName = TravelingSalesmanComponent.getCityName(props.geoJson);
    this.props.removeTravelingSalesmanCity(cityName);
  }

  renderSalesman(geoJson) {
    const { coordinates } = geoJson.geometry;
    const approximateMiddle = coordinates[(coordinates.length / 2).toFixed()];
    const markerGeoJson = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: approximateMiddle
      }
    };

    return (
      <GeoPath
        geoJson={markerGeoJson}
        {...geoPathPlacementSettings}
        fill="pink"
      />
    );
  }

  renderRoutes() {
    // Derive active routes from the shortest tour path
    this.activeRoutes = this.props.shortestTourPath.map((city, index) => {
      var nextCity = this.props.shortestTourPath[index + 1];
      if (!nextCity) {
        nextCity = this.props.shortestTourPath[0];
      }

      const routeId = Utility.getRouteId(city, nextCity);
      var activeRoute = this.props.routes[routeId];
      if (!activeRoute) {
        return null;
      }
      activeRoute = Object.assign({}, activeRoute);
      activeRoute.reversed = false;
      if (routeId.indexOf(city) !== 0) {
        activeRoute.reversed = true;
      }
      return activeRoute;
    }).filter(Boolean);
    // Use a sequential color gradient to help represent direction of travel
    const scaleColor = d3.scaleSequential()
      .domain([0, this.activeRoutes.length - 1])
      .interpolator(d3.interpolateViridis);

    return _.map(this.activeRoutes, (route, index) => {
      return (
        <GeoPath
          geoJson={route.geoJson}
          {...geoPathPlacementSettings}
          fillOpacity="0.0"
          stroke={scaleColor(index)}
          strokeWidth="2"
          key={`tour-index-${index}`}
          pathId={encodePathId(`${route.from.city};${route.to.city}`, route.reversed)}
        />
      );
    });
  }

  renderCities() {
    return this.props.selectedCities.map(city => {
      return (
        <GeoPath
          geoJson={city}
          {...geoPathPlacementSettings}
          fill="orange"
          pointRadius={usaMap.cityRadius}
          handleClick={this.handleCityClick}
          key={`${city.properties.city}, ${city.properties.state}`}
        />
      );
    });
  }

  renderCityClickMessage() {
    if (!this.props.selectedCities.length) {
      return <div />;
    }
    return (
      <div id="city-click-message">
        <strong>To remove a city, click on it.</strong> The displayed route is the shortest path found by the algorithm.
      </div>
    );
  }

  render() {
    return (
      <div id="traveling-salesman-wrapper">
        <InputWithSuggestions
          formId="traveling-salesman-form"
          inputId="traveling-salesman-input"
          placeholder="City"
          submitValue="Add"
          suggestions={this.props.suggestions}
          threshold={config.inputSuggestionsThreshold}
          handleSubmit={this.props.addTravelingSalesmanCity}
          label="Add cities one at a time."
          autoFocus={true}
        />
        {this.renderCityClickMessage()}
        <div id="traveling-salesman-map-wrapper">
          <svg width={width} height={height}>
            <GeoPath
              geoJson={usaStatesBoundary}
              {...geoPathPlacementSettings}
              fill="#fff"
              stroke="#999"
            />
            {this.renderRoutes()}
            {this.renderCities()}
            <TravelingSalesmanMarker
              {...geoPathPlacementSettings}
              routes={this.props.routes}
              tourPath={this.props.shortestTourPath}
              durationFactor={config.salesmanSpeedFactor}
              fill="HotPink"
              pathId="traveling-salesman-marker"
            />
          </svg>
        </div>
      </div>
    );
  }
}

TravelingSalesmanComponent.getCityName = feature => {
  const { city, state } = feature.properties;
  return `${city}, ${state}`;
};

function mapStateToProps(reducers) {
  const {
    cities,
    routes,
    shortestTourPath,
    citiesInRoutes,
    suggestions,
    selectedCities
  } = reducers['/traveling-salesman'];

  return {
    cities,
    routes,
    shortestTourPath,
    citiesInRoutes,
    suggestions,
    selectedCities
  };
}

export default connect(mapStateToProps, {
  addTravelingSalesmanCity,
  removeTravelingSalesmanCity,
  getNewTravelingSalesmanRoutes
})(TravelingSalesmanComponent);
