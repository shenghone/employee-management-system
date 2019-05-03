import React, { Component } from "react";

import "./home.css";

class home extends Component {
  render() {
    return (
      <div className="homeWrapper">
        <div />
        <div className="webDesc">
          <h3>
            hover
            <br />
            to see description
          </h3>
        </div>
        <div className="descText">
          <h4>The web app</h4>
          <p>allows registered user to manage employees, projects and teams</p>
        </div>
      </div>
    );
  }
}

export default home;
