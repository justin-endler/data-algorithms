import React, { Component } from 'react';
import { connect } from 'react-redux';
import { insertBinarySearchTreeNode } from '../actions';
import { inflate } from 'zlib';

class BinaryTreeNodeInsert extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      value: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    const { tree } = this.props;

    this.props.insertBinarySearchTreeNode(this.state.value, tree);
    this.setState({
      value: ''
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="node-value-insert">
            Insert Node
            <input id="node-value-insert" type="text" className="form-control" value={this.state.value} onChange={this.handleChange} placeholder="Number" />
          </label>
          <input id="node-value-submit" type="submit" className="btn btn-primary" value="Insert" />
        </div>
      </form>
    );
  }
}

export default connect(null, { insertBinarySearchTreeNode })(BinaryTreeNodeInsert);
