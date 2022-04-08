import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import { withRouter } from "react-router-dom";

import { loginMutation } from "../queries/queries";

import "./login.css";

class login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      authentication: this.props.authenticated,
      errorMessage: "",
      defaultAccount: "demoaccount@gmail.com",
      defaultPassword: "Mas!@#113"
    };
  }

  checkAuthStatus = () => {
    if (this.state.authentication === true) {
      this.props.history.push("/");
    }
  };

  componentDidMount() {
    this.checkAuthStatus();
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  verifyAuthStatus = arg => {
    this.props.changeAuthCallFromChild(arg);
  };

  setErrorMessage = arg => {
    this.setState({ errorMessage: arg });
  };

  static getDerivedStateFromProps(props, state) {
    if (props.authenticated !== state.authentication) {
      return {
        authentication: props.authenticated
      };
    }
    return null;
  }

  submitForm = async event => {
    event.preventDefault();

    if (!this.state.authentication) {
      try {
        const suc = await this.props.loginMutation({
          variables: {
            email: this.state.defaultAccount,
            password: this.state.defaultPassword
          }
        });

        if (suc) {
          console.log(suc);
          this.verifyAuthStatus(true);
          this.props.history.push("/");
        }
      } catch (err) {
        this.setState({ errorMessage: "Incorrect email or password." });
      }
    } else {
      this.props.history.push("/");
    }
  };

  render() {
    return (
      <div className="loginWrapper">
        <h2>Login</h2>
        <p className="loginError">{this.state.errorMessage}</p>
        <form onSubmit={this.submitForm}>
          <label>email</label>
          <input
            type="email"
            value={this.state.defaultAccount}
            onChange={this.handleChange("defaultAccount")}
            required
          />
          <label>password</label>

          <input
            type="password"
            value={this.state.defaultPassword}
            onChange={this.handleChange("defaultPassword")}
            required
          />

          <button className="submitButton">submit</button>
        </form>
      </div>
    );
  }
}

export default compose(
  withRouter,
  graphql(loginMutation, {
    name: "loginMutation"
  })
)(login);
