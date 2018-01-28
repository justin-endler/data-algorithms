import React, { Component } from 'react';
import { connect } from 'react-redux';
import Tree from 'react-d3-tree';
import {
  path as d3Path,
  select as d3Select,
  zoom as d3Zoom,
  event as d3Event
} from 'd3';

import InputWithSuggestions from './InputWithSuggestions';

import {
  initBinarySearchTree,
  removeBinarySearchTreeNode,
  replaceBinarySearchTree,
  insertBinarySearchTreeNode
} from '../actions';

import '../css/BinarySearchTreeComponent.css';

const nodeTextLayout = {
  textAnchor: 'start',
  x: -5,
  y: -25
};
const transitionDuration = 300;
const nodeWidth = 20;
const nodeWidthBuffer = nodeWidth * 3;

class BinarySearchTreeComponent extends Component {
  constructor(props) {
    super(props);

    if (!props.tree) {
      this.props.initBinarySearchTree();
    }

    this.pathFunc = this.pathFunc.bind(this);
    this.validateInsert = this.validateInsert.bind(this);
    this.handleInsert = this.handleInsert.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  validateInsert(value = '') {
    value = value.trim();
    if (!value) {
      return false;
    }
    if (isNaN(value)) {
      return false;
    }
    return true;
  }

  handleInsert(value) {
    this.props.insertBinarySearchTreeNode(value, this.props.tree);
  }

  handleRemove(data) {
    data = data && data.name;
    const { tree } = this.props;

    this.props.removeBinarySearchTreeNode(data, tree);
  }

  componentDidUpdate(previousProps) {
    if (this.props.tree.compare(previousProps.tree)) {
      // Maintain appropriate zoom level
      const treeG = d3Select('.rd3t-g');
      const containerRect = this.treeContainer ? this.treeContainer.getBoundingClientRect() : null;
      var widthFactor = 1;
      if (!treeG.empty() && containerRect) {
        let treeGNode = treeG.node();
        let treeGRect = treeGNode.getBoundingClientRect();

        let zoomG = d3Zoom().on('zoom', () => {
          treeG.attr('transform', d3Event.transform);
        });

        let adjustedWidthFactor = containerRect.width / (treeGRect.width + nodeWidthBuffer);
        if (adjustedWidthFactor < 1) {
          widthFactor = adjustedWidthFactor;
          zoomG.transform(treeG, `scale(${widthFactor})`);
          treeGRect = treeGNode.getBoundingClientRect();
        }

        // Offset the graph to keep it visible
        if (treeGRect.left < 0) {
          if (widthFactor < 1) {
            zoomG.transform(treeG, `translate(${Math.abs(treeGRect.left) + nodeWidth}, 20) scale(${widthFactor})`);
          } else {
            zoomG.transform(treeG, `translate(${(containerRect.width / 2) + Math.abs(treeGRect.left) + nodeWidth}, 20) scale(${widthFactor})`);
          }
        } else if (treeGRect.right > containerRect.width) {
          zoomG.transform(treeG, `translate(${(containerRect.width / 2) - (treeGRect.right - containerRect.width) - nodeWidth}, 20) scale(${widthFactor})`);
        }
      }
      return;
    }
    // Update the tree if it is different than the last version.
    // This allows the translate function to recalculate for centering the tree.
    this.props.replaceBinarySearchTree(this.props.tree, this.treeContainer);
  }

  pathFunc(linkData, orientation) {
    const {
      source,
      target
    } = linkData;
    // hide paths to empty leaves
    if (target && target.name === 'leaf') {
      return;
    }

    const path = d3Path();
    path.moveTo(source.x, source.y);
    path.lineTo(target.x, target.y);
    return path;
  }

  renderInput() {
    return (
      <InputWithSuggestions
        formId="binary-tree-form"
        inputId="binary-tree-input"
        placeholder="Number"
        submitValue="Insert"
        validateSubmit={this.validateInsert}
        handleSubmit={this.handleInsert}
        label="Insert tree nodes one at a time."
        autoFocus={true}
      />
    );
  }

  render() {
    if (this.props.d3Representation.length) {
      return (
        <div>
          <div className="container">
            {this.renderInput()}
            <div>Click on a node to remove it.</div>
          </div>
          <div id="binary-search-tree-container" ref={tc => {this.treeContainer = tc;}}>
            <Tree
              data={this.props.d3Representation}
              translate={this.props.translate}
              orientation={'vertical'}
              pathFunc={this.pathFunc}
              collapsible={false}
              onClick={this.handleRemove}
              textLayout={nodeTextLayout}
              zoomable={false}
              transitionDuration={transitionDuration}
            />
          </div>
        </div>
      );
    }
    return <div className="container">{this.renderInput()}</div>;
  }
}

function mapStateToProps(reducers) {
  const { tree, d3Representation, translate } = reducers['/binary-search-tree'];
  return {
    tree,
    d3Representation,
    translate
  };
}

export default connect(mapStateToProps, {
  initBinarySearchTree,
  removeBinarySearchTreeNode,
  replaceBinarySearchTree,
  insertBinarySearchTreeNode
})(BinarySearchTreeComponent);
