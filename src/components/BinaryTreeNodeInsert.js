import React, { Component } from 'react';
import BinarySearcTree from './BinarySearchTreeComponent';

export default class BinaryTreeNodeInsert extends Component {
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
    this.props.onInsert(this.state.value);
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
            <input id="node-value-insert" type="text" className="form-control" value={this.state.value} onChange={this.handleChange} placeholder="Node value" />
          </label>
          <input id="node-value-submit" type="submit" className="btn btn-primary" value="Insert" />
        </div>
      </form>
    );
  }
}
