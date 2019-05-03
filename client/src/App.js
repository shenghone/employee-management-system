import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { graphql } from "react-apollo";
import NavBar from "./components/navbar/navbar";

import Employees from "./components/employees/employees";
import Employee from "./components/employees/employee/employee";
import EmployeeForm from "./components/employees/employee/employeeForm/employeeForm";

import Projects from "./components/projects/projects";
import Project from "./components/projects/project/project";
import ProjectForm from "./components/projects/project/projectForm/projectForm";
import NewProject from "./components/projects/newProject/newProjectForm";

import Teams from "./components/teams/teams";
import Team from "./components/teams/team/team";
import TeamForm from "./components/teams/team/teamForm/teamForm";
import NewTeam from "./components/teams/newTeam/newTeam";

import Register from "./components/register/register";
import Footer from "./components/footer/footer";
import Home from "./components/home/home";
import About from "./components/about/about";
import PrivateRoute from "./components/privatedRoute/privateRoute";
import Login from "./components/login/login";
import ErrorPage from "./components/errorPage/errorPage";
import { meQuery } from "./components/queries/queries";
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
