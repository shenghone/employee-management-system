import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { graphql } from "react-apollo";
import NavBar from "./navbar/navbar";

import Employees from "./employees/employees";
import Employee from "./employees/employee/employee";
import EmployeeForm from "./employees/employee/employeeForm/employeeForm";

import Projects from "./projects/projects";
import Project from "./projects/project/project";
import ProjectForm from "projects/project/projectForm/projectForm";
import NewProject from "./projects/newProject/newProjectForm";

import Teams from "./teams/teams";
import Team from "./teams/team/team";
import TeamForm from "./teams/team/teamForm/teamForm";
import NewTeam from "./teams/newTeam/newTeam";

import Register from "./register/register";
import Footer from "./footer/footer";
import Home from "./home/home";
import About from "./about/about";
import PrivateRoute from "./privatedRoute/privateRoute";
import Login from "./login/login";
import ErrorPage from "./errorPage/errorPage";
import { meQuery } from "./queries/queries";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultAuth: false
    };
  }

  componentDidMount() {
    this.connecToServer();
  }

  connecToServer = () => {
    fetch("/");
  };

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      this.checkAuth();
    }
  }

  checkAuth = () => {
    if (this.props.data.Me) {
      this.setState({ defaultAuth: true });
    }
  };

  changeAuthStatus = arg => {
    this.setState({ defaultAuth: arg });
  };

  render() {
    return (
      <BrowserRouter>
        <div
          className={
            this.state.defaultAuth === true ? "App brightApp" : "App darkApp"
          }
        >
          <NavBar
            authenticated={this.state.defaultAuth}
            changeAuthCallFromChild={this.changeAuthStatus}
          />
          <Switch>
            <Route
              exact
              path="/login"
              component={() => (
                <Login
                  authenticated={this.state.defaultAuth}
                  history={this.props.history}
                  changeAuthCallFromChild={this.changeAuthStatus}
                />
              )}
            />
            <Route
              path="/signup"
              exact
              render={props => (
                <Register
                  changeAuthStatus={this.changeAuthStatus}
                  defaultAuth={this.state.defaultAuth}
                />
              )}
            />
            <Route exact path="/" component={Home} />
            <Route
              exact
              path="/about"
              render={props => <About authenticated={this.state.defaultAuth} />}
            />

            <PrivateRoute
              path="/team/edit/:teamId"
              exact
              component={TeamForm}
            />
            <PrivateRoute path="/teams" exact component={Teams} />
            <PrivateRoute path="/team/new" exact component={NewTeam} />
            <PrivateRoute path="/team/:teamId" exact component={Team} />

            <PrivateRoute path="/project/new" exact component={NewProject} />

            <PrivateRoute
              path="/project/edit/:projectId"
              exact
              component={ProjectForm}
            />
            <PrivateRoute
              path="/project/:projectId"
              exact
              component={Project}
            />
            <PrivateRoute path="/employees" exact component={Employees} />
            <PrivateRoute
              path="/employee/:employeeId"
              exact
              component={Employee}
            />
            <PrivateRoute
              path="/employee/edit/:employeeId"
              exact
              component={EmployeeForm}
            />
            <PrivateRoute exact path="/projects" component={Projects} />
            <Route component={ErrorPage} />
          </Switch>
          <Footer />
        </div>
      </BrowserRouter>
    );
  }
}

export default graphql(meQuery)(App);
