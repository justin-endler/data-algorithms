import React, { Component } from 'react';
import { connect } from 'react-redux';
import GeoPath from './GeoPath';

import {
  moveTravelingSalesmanMarker,
  updateTravelingSalesmanMarkerPoints
} from '../actions';

import Utility from '../classes/Utility';

const geoJson = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'Point',
    coordinates: []
  }
};

class TravelingSalesmanMarker extends Component {
  constructor(props) {
    super(props);

    const {
      scale,
      rotate,
      center,
      translate
    } = props; // @todo this sucks. also occurs a lot in mapStateToProps, anything better out there?

    this.geoPathPlacementSettings = {
      scale,
      rotate,
      center,
      translate
    };
  }

  componentWillReceiveProps(nextProps) {
    // Set points to travel over if tour has changed
    if (nextProps.tourPath.length === this.props.tourPath.length) {
      return;
    }
    var points = [];
    nextProps.tourPath.forEach((fromCity, index) => {
      var toCity = nextProps.tourPath[index + 1];
      if (!toCity) {
        toCity = nextProps.tourPath[0];
      }
      // Determine direction of route and adjust
      var routeId = `${fromCity};${toCity}`;
      var route = nextProps.routes[routeId];
      var coordinates;
      if (route) {
        coordinates = Utility.findValue(route, 'geoJson.geometry.coordinates', []);
        points = points.concat(coordinates);
      } else {
        routeId = `${toCity};${fromCity}`;
        route = nextProps.routes[routeId];
        coordinates = Utility.findValue(route, 'geoJson.geometry.coordinates', []);
        points = points.concat(coordinates.slice().reverse());
      }
    });

    this.props.updateTravelingSalesmanMarkerPoints(points);
  }

  componentDidUpdate() {
    // @todo create stop/start button
    setTimeout(() => {
      this.props.moveTravelingSalesmanMarker();
    }, this.props.interval); // @todo use propTypes to defaul the interval to something
  }

  render() {
    if (!this.props.points.length) {
      return <g />;
    }

    geoJson.geometry.coordinates = this.props.points[this.props.markerIndex];

    // @todo use propTypes or whatever to default props.fill to something
    return (
      <GeoPath
        geoJson={geoJson}
        {...this.geoPathPlacementSettings}
        fill={this.props.fill}
      />
    );
  };
}

function mapStateToProps(reducers) {
  const {
    markerIndex,
    points
  } = reducers['/traveling-salesman/marker'];

  return {
    markerIndex,
    points
  };
}

export default connect(mapStateToProps, {
  moveTravelingSalesmanMarker,
  updateTravelingSalesmanMarkerPoints
})(TravelingSalesmanMarker);