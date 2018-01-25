import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  scaleSequential as d3ScaleSequential,
  interpolateViridis as d3InterpolateViridis
} from 'd3';

import GeoPath from './GeoPath';
import InputWithSuggestions from './InputWithSuggestions';
import TravelingSalesmanMarker from './TravelingSalesmanMarker';

import Utility from '../classes/Utility';

import {
  addTravelingSalesmanCity,
  getNewTravelingSalesmanRoutes
} from '../actions';

import '../css/TravelingSalesman.css';

import usaStatesBoundary from '../data/usa-states-boundary';

// configure to show the USA lower 48
const width = 1400;
const height = 540;

const geoPathPlacementSettings = {
  scale: 1000,
  rotate: [90, 0],
  center: [-7, 38],
  translate: [width/2, height/2]
};

class TravelingSalesmanComponent extends Component {
  constructor(props) {
    super(props);

    this.activeRoutes = [];
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
    for (let i = 0; i < selectedCities.features.length; i++) {
      for (let j = i; j < selectedCities.features.length; j++) {
        let feature1 = selectedCities.features[i];
        let feature2 = selectedCities.features[j];

        this._addRouteObject(feature1, feature2, routes, newRoutes);
      }
    }

    this.props.getNewTravelingSalesmanRoutes(newRoutes);
  }

  _addRouteObject(feature1, feature2, routes, newRoutes) {
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
      return this.props.routes[routeId];
    }).filter(Boolean);
    // Use a sequential color gradient to help represent direction of travel
    const scaleColor = d3ScaleSequential()
      .domain([0, this.activeRoutes.length - 1])
      .interpolator(d3InterpolateViridis);

    return _.map(this.activeRoutes, (route, index) => {
      return (
        <GeoPath
          geoJson={route.geoJson}
          {...geoPathPlacementSettings}
          fillOpacity="0.0"
          stroke={scaleColor(index)}
          strokeWidth="2"
          key={`tour-index-${index}`}
        />
      );
    });
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
          threshold={1}
          handleSubmit={this.props.addTravelingSalesmanCity}
          label="Add one city at a time."
        />
        <div id="traveling-salesman-map-wrapper">
          <svg width={width} height={height}>
            <GeoPath
              geoJson={usaStatesBoundary}
              {...geoPathPlacementSettings}
              fill="#fff"
              stroke="#999"
            />
            {this.renderRoutes()}
            <GeoPath
              geoJson={this.props.selectedCities}
              {...geoPathPlacementSettings}
              fill="orange"
            />
            <TravelingSalesmanMarker
              {...geoPathPlacementSettings}
              routes={this.props.routes}
              tourPath={this.props.shortestTourPath}
              interval={350}
              fill="HotPink"
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
  getNewTravelingSalesmanRoutes
})(TravelingSalesmanComponent);

// @todo implement removal of a city
