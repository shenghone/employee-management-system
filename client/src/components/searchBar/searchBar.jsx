import React, { Component } from "react";

import "./searchBar.css";

export default class searchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="searchBarWrapper">
        <input
          type="text"
          className="searchInput"
          placeholder={this.props.displayedMessage}
          onChange={event => this.props.search(event.target.value)}
        />
        <button className="searchButton">
          <i className="fas fa-search" id="icon" />
        </button>
        <p id="searchText">search</p>
      </div>
    );
  }
}
