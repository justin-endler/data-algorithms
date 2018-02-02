import React, { Component } from 'react';

class InputWithSuggestions extends Component {
  constructor(props) {
    super(props);

    this.threshold = props.threshold || 2;

    this.state = {
      value: '',
      matchingSuggestions: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSuggestionClick = this.handleSuggestionClick.bind(this);
  }

  handleChange(e) {
    const { suggestions } = this.props;
    const value = e.target.value;
    var matchingSuggestions = [];
    if (value && value.length >= this.threshold && suggestions.length) {
      // get suggestions that begin with the current value
      matchingSuggestions = suggestions.map(suggestion => {
        suggestion = suggestion.trim();
        if (suggestion.toLowerCase().indexOf(value.trim().toLowerCase()) > -1) {
          return suggestion;
        }
        return null;
      }).filter(Boolean);
    }
    // Sort matching suggestions by proximity of match to the start of the value
    matchingSuggestions = matchingSuggestions.sort((a, b) => {
      const aIndex = a.indexOf(value);
      const bIndex = b.indexOf(value);
      if (aIndex > bIndex) {
        return 1;
      }
      if (bIndex > aIndex) {
        return -1;
      }
      return 0;
    });

    this.setState({
      value,
      matchingSuggestions
    });
  }

  handleSubmit(e) {
    if (e) {
      e.preventDefault();
    }
    if (this.props.validateSubmit && !this.props.validateSubmit(this.state.value)) {
      return;
    }
    this.props.handleSubmit(this.state.value);

    this.setState({
      value: '',
      matchingSuggestions: []
    });
  }

  handleSuggestionClick(e) {
    e.preventDefault();

    this.setState({
      value: e.target.textContent,
      matchingSuggestions: []
    });
  }

  renderMatchingSuggestions() {
    if (!this.state.matchingSuggestions.length) {
      return '';
    }

    const matchingSuggestions = this.state.matchingSuggestions.map((suggestion, index) => {
      return <a onClick={this.handleSuggestionClick} className="list-group-item list-group-item-action" key={index}>{suggestion}</a>;
    });

    return (
      <div className="col-sm-3 list-group">
        {matchingSuggestions}
      </div>
    );
  }

  render() {
    return (
      <form id={this.props.formId} onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor={this.props.inputId}>
            {this.props.label || ''}
            <input
              id={this.props.inputId}
              type="text"
              className="form-control"
              value={this.state.value}
              onChange={this.handleChange}
              placeholder={this.props.placeholder}
              autoComplete="off"
              autoFocus={this.props.autoFocus || false}
            />
          </label>
          <input
            type="submit"
            className="btn btn-primary"
            value={this.props.submitValue}
          />
        </div>
        {this.renderMatchingSuggestions()}
      </form>
    );
  }
}

InputWithSuggestions.defaultProps = {
  suggestions: []
};

export default InputWithSuggestions;