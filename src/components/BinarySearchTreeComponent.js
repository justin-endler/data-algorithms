import React, { Component } from 'react';
import { connect } from 'react-redux';
import Tree from 'react-d3-tree';
import { path as d3Path } from 'd3';
import InputWithSuggestions from './InputWithSuggestions';

import {
  initBinarySearchTree,
  removeBinarySearchTreeNode,
  replaceBinarySearchTree,
  insertBinarySearchTreeNode
} from '../actions';

import '../css/BinarySearchTreeComponent.css';

class BinarySearchTreeComponent extends Component {
  constructor(props) {
    super(props);

    if (!props.tree) {
      this.props.initBinarySearchTree();
    }

    this.pathFunc = this.pathFunc.bind(this);
    this.handleInsert = this.handleInsert.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  // @todo grow-shrink the BST as needed to fit the screen

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

  _diagonalPath({ source, target }) {
    const path = d3Path()
    path.moveTo(source.x, source.y);
    path.lineTo(target.x, target.y);

    return path;
  }

  render() {
    if (this.props.d3Representation.length) {
      return (
        <div>
          <div className="container">
            <InputWithSuggestions
              formId="binary-tree-form"
              inputId="binary-tree-input"
              placeholder="Number"
              submitValue="Insert"
              handleSubmit={this.handleInsert}
              label="Insert Node"
            />
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
        {/* <BinaryTreeNodeInsert tree={this.props.tree} /> */}
        <InputWithSuggestions
          formId="binary-tree-form"
          inputId="binary-tree-input"
          placeholder="Number"
          submitValue="Insert"
          handleSubmit={this.handleInsert}
          label="Insert Node"
        />
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
  replaceBinarySearchTree,
  insertBinarySearchTreeNode
})(BinarySearchTreeComponent);