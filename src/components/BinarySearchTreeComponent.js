import React, { Component } from 'react';
import BinarySearchTree from '../classes/BinarySearchTree';
import BinaryTreeNodeInsert from './BinaryTreeNodeInsert';
import Tree from 'react-d3-tree';
import { svg } from 'd3';

export default class BinarySearchTreeComponent extends Component {
  constructor(props) {
    super(props);

    const tree = new BinarySearchTree();

    this.state = {
      tree,
      arrayRepresentation: tree.getArrayRepresentation(),
      translate: undefined
    };

    this.handleInsert = this.handleInsert.bind(this);
    this.pathFunc = this.pathFunc.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  handleInsert(data) {
    var tree = this.state.tree.clone();
    tree.insert(data);
    this._setState(tree);
  }

  handleRemove(data) {
    data = data && data.name;
    var tree = this.state.tree.clone();
    tree.remove(data);
    console.info("tree", tree); // @test
    this._setState(tree);
  }

  _setState(tree) {
    var translate;
    if (this.treeContainer) {
      let dimensions = this.treeContainer.getBoundingClientRect();
      translate = {
        x: dimensions.width / 2,
        y: dimensions.height / 4
      };
    }

    this.setState({
      // update the real linked tree structure
      tree,
      // update the array representation
      arrayRepresentation: tree.getArrayRepresentation(),
      // center the tree
      translate
    });
  }

  componentDidUpdate(previousProps, previousState) {
    if (this.state.tree.compare(previousState.tree)) {
      return;
    }

    this._setState(this.state.tree.clone());
  }

  // custom port of react-d3-tree's diagonalPath
  _diagonalPath(linkData) {
    const diagonal = svg
      .diagonal()
      .projection(d => ([d.x, d.y]));
    return diagonal(linkData);
  }

  pathFunc(linkData, orientation) {
    // hide paths to empty leaves
    if (linkData.target && linkData.target.name === 'leaf') {
      return;
    }
    return this._diagonalPath(linkData);
  }

  render() {
    if (this.state.arrayRepresentation.length) {
      return (
        <div>
          <BinaryTreeNodeInsert onInsert={this.handleInsert} />
          <div>Click on a node to remove it.</div>
          <div id="binary-search-tree-container" ref={tc => {this.treeContainer = tc;}}>
            <Tree
              data={this.state.arrayRepresentation}
              translate={this.state.translate}
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
      <div>
        <BinaryTreeNodeInsert onInsert={this.handleInsert} />
      </div>
    );
  }
}
