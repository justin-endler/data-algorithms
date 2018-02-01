import React, { Component } from 'react';
import * as d3 from 'd3';

class GeoPath extends Component {
  constructor(props) {
    super(props);

    const {
      scale,
      rotate,
      center,
      translate,
      geoJson,
      pointRadius,
      handleClick
    } = props;

    this.albersProjection = d3.geoAlbers()
      .scale(scale)
      .rotate(rotate)
      .center(center)
      .translate(translate);

    var geoPath;
    // Set size of Point type path
    if (pointRadius !== undefined) {
      geoPath = d3.geoPath()
        .projection(this.albersProjection)
        .pointRadius(pointRadius);
    } else {
      geoPath = d3.geoPath()
        .projection(this.albersProjection);
    }

    const path = geoPath(geoJson);

    this.state = {
      geoPath,
      path,
      pathProps: this._resolvePathProps(props)
    };

    this.handleClick = this.handleClick.bind(this);
  }

  _resolvePathProps(props) {
    return {
      fill: props.fill || '#000',
      stroke: props.stroke || props.fill,
      fillOpacity: props.fillOpacity || '1.0',
      strokeWidth: props.strokeWidth || '1'
    };
  }

  componentWillReceiveProps(nextProps) {
    var geoPath;
    // Set size of Point type path
    if (nextProps.pointRadius !== undefined) {
      geoPath = d3.geoPath()
        .projection(this.albersProjection)
        .pointRadius(nextProps.pointRadius);
    } else {
      geoPath = d3.geoPath()
        .projection(this.albersProjection);
    }

    const path = geoPath(nextProps.geoJson);

    this.setState(Object.assign({}, {
      geoPath,
      path,
      pathProps: this._resolvePathProps(nextProps)
    }));
  }

  handleClick(event) {
    this.props.handleClick(event, this.props, this.state);
  }

  renderPath() {
    if (this.props.handleClick) {
      return <path {...this.state.pathProps} d={this.state.path} id={this.props.pathId} onClick={this.handleClick} />;
    }
    return <path {...this.state.pathProps} d={this.state.path} id={this.props.pathId} />;
  }

  render() {
    const props = this.props;
    if (!(props.geoJson && props.scale && props.rotate && props.center && props.translate)) {
      return <g />;
    }
    return (
      <g>
        {this.renderPath()}
      </g>
    );
  }
}

export default GeoPath;