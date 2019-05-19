import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import async from 'async';
import Utility from 'classes/Utility';

import GeoPath from 'components/GeoPath';

import { updateTravelingSalesmanMarkerPaths } from 'actions';

const geoJson = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'Point',
    coordinates: []
  }
};

const translateAlong = Symbol('translateAlong');

class TravelingSalesmanMarker extends Component {
  constructor(props) {
    super(props);

    const {
      scale,
      rotate,
      center,
      translate
    } = props;

    this.geoPathPlacementSettings = {
      scale,
      rotate,
      center,
      translate
    };
  }

  componentWillReceiveProps(nextProps) {
    // Set paths to travel over if tour has changed
    if (nextProps.tourPath.length === this.props.tourPath.length) {
      return;
    }

    const tweenData = nextProps.tourPath.map((fromCity, index) => {
      var toCity = nextProps.tourPath[index + 1];
      if (!toCity) {
        toCity = nextProps.tourPath[0];
      }
      // There's only one city on the map, return
      if (fromCity === toCity) {
        return null;
      }
      // Determine direction of route and adjust
      var routeId = `${fromCity};${toCity}`;
      var reversed = false;
      var route = nextProps.routes[routeId];
      var origin = Utility.findValue(route, 'from.coordinates');

      if (!route) {
        routeId = `${toCity};${fromCity}`;
        route = nextProps.routes[routeId];
        origin = Utility.findValue(route, 'to.coordinates');
        reversed = true;
      }

      return {
        id: encodePathId(routeId, reversed),
        reversed,
        origin
      };
    }).filter(Boolean);

    this.props.updateTravelingSalesmanMarkerPaths(tweenData);
  }

  componentDidUpdate() {
    const { tweenData } = this.props;
    if (!tweenData) {
      return;
    }

    const markerElement = d3.select(`#${this.props.pathId}`);
    async.eachSeries(
      tweenData,
      (path, callback) => {
        const pathElement = d3.select(`#${path.id}`).node();
        if (!pathElement) {
          return callback();
        }

        // Move the marker to fromCity
        const markerPathData = markerElement.attr('d');
        const fromPoint = pathElement.getPointAtLength(0);
        const pathLength = pathElement.getTotalLength();

        if (markerPathData && markerPathData.indexOf('M') === 0) {
          let moveToCoordinatesEndPosition = markerPathData.split(/[a-zA-Z]/)[1].length;
          let newMarkerPathData = `M${fromPoint.x},${fromPoint.y}${markerPathData.slice(moveToCoordinatesEndPosition)}`;
          markerElement.attr('d', newMarkerPathData);
        }

        markerElement
          .transition()
          .duration(pathLength * this.props.durationFactor)
          .attrTween('transform', this[translateAlong](pathElement, pathLength, fromPoint, path))
          .on('end', callback);
      }
    );
  }

  [translateAlong] = (pathElement, pathLength, fromPoint, path) => {
    var tTerm = 0;
    if (path.reversed) {
      tTerm = -1;
    }

    return () => {
      return time => {
        time = Math.abs(time + tTerm);
        const point = pathElement.getPointAtLength(time * pathLength);
        return `translate(${point.x - fromPoint.x}, ${point.y - fromPoint.y})`;
      };
    };
  }

  render() {
    var { tweenData } = this.props;
    if (!tweenData.length) {
      return <g />;
    }

    const currentGeoJson = Object.assign({}, geoJson);

    var origin = tweenData[0].origin;
    if (tweenData[0].reversed) {
      origin = tweenData[1].origin;
    }
    currentGeoJson.geometry.coordinates = origin;

    return (
      <GeoPath
        geoJson={currentGeoJson}
        {...this.geoPathPlacementSettings}
        fill={this.props.fill}
        ref={geoPath => {this.geoPath = geoPath;}}
        pathId={this.props.pathId}
      />
    );
  };
}

// Allows usage of the "fromCity; toCity" id format but encodes for use in DOM element ids
const encodePathId = (str = '', reversed) => {
  str = str
    .replace(/[\s.]/g, '')
    .replace(/,/g, '-')
    .replace(';','_');
  if (reversed) {
    str += '_reversed';
  }

  return str;
};

function mapStateToProps(reducers) {
  const { tweenData } = reducers['/traveling-salesman/marker'];

  return { tweenData };
}

export { encodePathId };

export default connect(mapStateToProps, { updateTravelingSalesmanMarkerPaths })(TravelingSalesmanMarker);
