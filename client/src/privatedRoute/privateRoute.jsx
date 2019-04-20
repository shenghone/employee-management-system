import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { graphql } from "react-apollo";
import { meQuery } from "../queries/queries";

class privateRoute extends Component {
  renderRoute = () => {
    const { data, component: Component, ...rest } = this.props;
    if (!data || data.loading) {
      return null;
    }
    if (!data.Me) {
      return <Redirect to="/login" />;
    }
    return <Component {...rest} />;
  };
  render() {
    const { data, component, ...rest } = this.props;
    return <Route {...rest} render={this.renderRoute} />;
  }
}

export default graphql(meQuery)(privateRoute);
