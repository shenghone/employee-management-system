import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { graphql, compose } from "react-apollo";
import { signOutMutation } from "../queries/queries";
import { withRouter } from "react-router-dom";
import "./navbar.css";

class navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authStatus: this.props.authenticated,
      burgerClassIndicator: false,
      currentUrl: props.location.pathname
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.authenticated !== state.authStatus) {
      return {
        authStatus: props.authenticated
      };
    }
    if (props.location !== state.location) {
      return { currentUrl: props.location.pathname };
    }
    return null;
  }

  classType = () => {
    if (this.state.currentUrl === "/" && this.props.authenticated) {
      return "NavClass whiteNav";
    } else {
      return "NavClass darkNav";
    }
  };

  /*setCurrentNav = val => event => {
    this.setState({
      [name]: event.target.value
    });
  };*/

  toggleBurgerClass = () => {
    if (this.state.authStatus) {
      this.setState({ burgerClassIndicator: !this.state.burgerClassIndicator });
    } else {
      this.setState({ burgerClassIndicator: true });
    }
  };

  signOut = () => {
    try {
      const suc = this.props.signOutMutation({});
      if (suc) {
        this.changeAuthStatusFromNav(false);
        this.props.history.push("/");
        console.log("logged out");
      }
    } catch (err) {}
  };

  changeAuthStatusFromNav = arg => {
    this.props.changeAuthCallFromChild(arg);
  };

  render() {
    const { authStatus } = this.state;

    if (authStatus) {
      return (
        <div className="navbarWrapper whiteNav">
          <div
            className={
              this.state.burgerClassIndicator ? "burger clicked" : "burger"
            }
            onClick={this.toggleBurgerClass}
          >
            <span className="line line1" />
            <span className="line line2" />
            <span className="line line3" />
          </div>
          <ul>
            <NavLink
              activeClassName="activeClass"
              exact
              className={this.classType()}
              to="/"
            >
              Home
            </NavLink>
            <NavLink
              activeClassName="activeClass"
              className={this.classType()}
              to="/employees"
            >
              Employees
            </NavLink>
            <NavLink
              activeClassName="activeClass"
              className={this.classType()}
              to="/projects"
            >
              Projects
            </NavLink>
            <NavLink
              activeClassName="activeClass"
              className={this.classType()}
              to="/teams"
            >
              Teams
            </NavLink>
            <NavLink
              activeClassName="activeClass"
              className={this.classType()}
              to="/about"
            >
              About
            </NavLink>
            <li className={this.classType()} onClick={this.signOut}>
              Sign out
            </li>
          </ul>
        </div>
      );
    } else {
      return (
        <div className="navbarWrapper">
          <ul>
            <NavLink
              exact
              className="NavClass whiteNav"
              activeClassName="activeClass"
              to="/"
            >
              Home
            </NavLink>
            <NavLink
              exact
              className="NavClass whiteNav"
              activeClassName="activeClass"
              to="/about"
            >
              About
            </NavLink>
            <NavLink
              exact
              className="NavClass whiteNav"
              activeClassName="activeClass"
              to="/login"
            >
              Sing in
            </NavLink>
            <NavLink
              exact
              className="NavClass whiteNav"
              activeClassName="activeClass"
              to="/signup"
            >
              Sign up
            </NavLink>
          </ul>
        </div>
      );
    }
  }
}

export default compose(
  withRouter,
  graphql(signOutMutation, { name: "signOutMutation" })
)(navbar);
