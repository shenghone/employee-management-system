import React, { Component } from "react";

import "./home.css";

class home extends Component {
  /*constructor(props) {
    super();
    this.state = {
      textColor: "white"
    };
  }*/

  getTextColor = () => {
    if (this.props.authenticated) {
      return "black";
    } else {
      return "white";
    }
  };

  render() {
    return (
      <div className="homeWrapper">
        <div />
        <div className="webDesc">
          <h3 className={this.getTextColor()}>
            hover
            <br />
            to see description
          </h3>
        </div>
        <div className="descText">
          <h4 className={this.getTextColor()}>The web app</h4>
          <p>allows registered user to manage employees, projects and teams</p>
        </div>
      </div>
    );
  }
}

export default home;
