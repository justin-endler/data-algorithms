import React, { Component } from 'react';
import { connect } from 'react-redux';
import Tree from 'react-d3-tree';
import { svg } from 'd3';
import BinaryTreeNodeInsert from './BinaryTreeNodeInsert';
import {
  initBinarySearchTree,
  removeBinarySearchTreeNode,
  replaceBinarySearchTree
} from '../actions';

import '../css/BinarySearchTreeComponent.css';

class BinarySearchTreeComponent extends Component {
  constructor(props) {
    super(props);

    if (!props.tree) {
      this.props.initBinarySearchTree();
    }

    this.pathFunc = this.pathFunc.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  handleRemove(data) {
    data = data && data.name;
    const { tree } = this.props;

    this.props.removeBinarySearchTreeNode(data, tree);
  }

  componentDidUpdate(previousProps) {
    if (this.props.tree.compare(previousProps.tree)) {
      return;
    }
    // Update the tree if it is different than the last version.
    // This allows the translate function to recalculate for centering the tree.
    this.props.replaceBinarySearchTree(this.props.tree, this.treeContainer);
  }

  pathFunc(linkData, orientation) {
    // hide paths to empty leaves
    if (linkData.target && linkData.target.name === 'leaf') {
      return;
    }
    return this._diagonalPath(linkData);
  }

  // custom port of react-d3-tree's diagonalPath
  _diagonalPath(linkData) {
    const diagonal = svg
      .diagonal()
      .projection(d => ([d.x, d.y]));
    return diagonal(linkData);
  }

  render() {
    if (this.props.d3Representation.length) {
      return (
        <div>
          <div className="container">
            <BinaryTreeNodeInsert tree={this.props.tree} />
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
            />
          </div>
        </div>
      );
    }
    return (
      <div className="container">
        <BinaryTreeNodeInsert tree={this.props.tree} />
      </div>
    );
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
  replaceBinarySearchTree
})(BinarySearchTreeComponent);