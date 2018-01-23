import React from 'react';
import {
  geoAlbers as d3GeoAlbers,
  geoPath as d3GeoPath
} from 'd3';

export default props => {
  const {
    geoJson,
    scale,
    rotate,
    center,
    translate
  } = props;

  const pathProps = {
    fill: props.fill || '#000',
    stroke: props.stroke || props.fill,
    fillOpacity: props.fillOpacity || '1.0',
    strokeWidth: props.strokeWidth || '1'
  };

  if (!(geoJson && scale && rotate && center && translate)) {
    return <g />;
  }

  const albersProjection = d3GeoAlbers()
    .scale(scale)
    .rotate(rotate)
    .center(center)
    .translate(translate);

  const geoPath = d3GeoPath()
    .projection(albersProjection);

// @todo bus the marker drawing speed up to properties and then up to app config
  const path = geoPath(geoJson);

  return (
    <g>
      <path {...pathProps} d={path} />
    </g>
  );
};