import React, { Component } from "react";
import { Route } from "react-router-dom";
import { graphql } from "react-apollo";
import { meQuery } from "../queries/queries";

class privateRouteToMain extends Component {
  renderRoute = () => {
    const { data, component: Component, ...rest } = this.props;
    if (!data || data.loading) {
      return null;
    }
    if (data.Me) {
      return <Redirect to="/" />;
    }
    return <Component {...rest} />;
  };
  render() {
    console.log(this.props);
    const { data, component, ...rest } = this.props;
    return <Route {...rest} render={this.renderRoute} />;
  }
}

export default graphql(meQuery)(privateRouteToMain);
