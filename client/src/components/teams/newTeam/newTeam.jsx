import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import dayjs from "dayjs";
import {
  projectsQuery,
  employeesQuery,
  teamsQuery,
  createTeamMutation
} from "../../queries/queries";
import { CreateTeam } from "../../schema/schema";
import { Formik, Field, Form, ErrorMessage } from "formik";

class newTeam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInput: "",
      sortByName: "default",
      sortByPosition: "default"
    };
  }
  exitNewTeamForm = () => {
    this.props.history.push("/teams");
  };

  handleSearch = event => {
    this.setState({ userInput: event.target.value });
  };

  toSortByName = () => {
    this.setState({
      sortByName: !this.state.sortByName,
      sortByPosition: "default"
    });
  };

  toSortByPosition = () => {
    this.setState({
      sortByName: "default",
      sortByPosition: !this.state.sortByPosition
    });
  };

  checkIfNameIsUsed = (TeamsObj, name) => {
    let foundObj;
    TeamsObj.map(function(TeamObj) {
      if (TeamObj.TeamName.toUpperCase() === name.trim().toUpperCase()) {
        foundObj = TeamObj;
      }
      return TeamObj;
    });
    return foundObj;
  };

  render() {
    if (
      !this.props.employeesQuery ||
      this.props.employeesQuery.loading ||
      !this.props.projectsQuery ||
      this.props.projectsQuery.loading ||
      !this.props.teamsQuery ||
      this.props.teamsQuery.loading ||
      !this.props.createTeamMutation ||
      this.props.createTeamMutation.loading
    ) {
      return null;
    }

    let filteredEmp = this.props.employeesQuery.Employees.filter(emp => {
      return (
        emp.FirstName.toUpperCase().indexOf(
          this.state.userInput.toUpperCase()
        ) !== -1 ||
        emp.LastName.toUpperCase().indexOf(
          this.state.userInput.toUpperCase()
        ) !== -1 ||
        (
          emp.FirstName.toUpperCase() +
          " " +
          emp.LastName.toUpperCase()
        ).indexOf(this.state.userInput.toUpperCase()) !== -1 ||
        emp.Position.PositionName.toUpperCase().indexOf(
          this.state.userInput.toUpperCase()
        ) !== -1
      );
    });

    let filteredProject = this.props.projectsQuery.Projects.filter(Project => {
      return (
        Project.ProjectName.toUpperCase().indexOf(
          this.state.userInput.toUpperCase()
        ) !== -1
      );
    });

    const { sortByName, sortByPosition } = this.state;

    if (sortByName === true) {
      filteredEmp = _.sortBy(filteredEmp, "FirstName");
    } else if (sortByName === false) {
      filteredEmp = _.sortBy(filteredEmp, "FirstName").reverse();
    }

    if (sortByPosition === true) {
      filteredEmp = _.sortBy(filteredEmp, function(emp) {
        return emp.Position.PositionName;
      });
    } else if (sortByPosition === false) {
      filteredEmp = _.sortBy(filteredEmp, function(emp) {
        return emp.Position.PositionName;
      }).reverse();
    }
    const { createTeamMutation } = this.props;
    const { Teams } = this.props.teamsQuery;
    console.log("team form is called");
    return (
      <div className="editTeamWrapper">
        <div className="statusBar" onClick={this.exitNewTeamForm} />
        <div className="editTeamLeft">
          <div className="editTeamLeftAreas">
            <h2 className="teamFormTeamName">New team</h2>
          </div>
        </div>
        <Formik
          initialValues={{
            Employees: [],
            TeamName: "",
            Projects: [],
            TeamLead: ""
          }}
          validationSchema={CreateTeam}
          onSubmit={async (values, { setSubmitting }) => {
            const newTeam = createTeamMutation({
              variables: {
                TeamLeadId: values.TeamLead,
                ProjectIds: values.Projects,
                EmployeeIds: values.Employees,
                TeamName: values.TeamName
              },
              refetchQueries: [
                {
                  query: teamsQuery
                }
              ]
            });
            if (newTeam) {
              setSubmitting(false);
              this.exitNewTeamForm();
            }
          }}
          render={({
            errors,
            values,
            isSubmitting,
            setFieldValue,
            handleBlur,
            setFieldError,
            setFieldTouched
          }) => (
            <Form className="editTeamForm">
              <div className="editTeamFormTop">
                <label name="teamName" className="renameTeam">
                  team name
                  <br />
                  <Field
                    type="text"
                    name="TeamName"
                    className={!errors.TeamName ? "defaultInput" : "errorInput"}
                    value={values.TeamName}
                    onBlur={event => {
                      if (errors) {
                        if (errors.TeamName === "Team name has been taken") {
                          setFieldTouched("TeamName", true, false);
                          setFieldError("TeamName", "name has been taken");
                        } else {
                          setFieldTouched("TeamName", true, true);
                        }
                      }
                    }}
                    onChange={event => {
                      const foundObj = this.checkIfNameIsUsed(
                        Teams,
                        event.target.value
                      );
                      if (foundObj) {
                        if (foundObj.id !== this.props.currentTeam) {
                          setFieldValue("TeamName", event.target.value, false);
                          setFieldError("TeamName", "Team name has been taken");
                        } else {
                          setFieldValue("TeamName", event.target.value);
                        }
                      } else {
                        setFieldValue("TeamName", event.target.value);
                      }
                    }}
                  />
                  <ErrorMessage name="TeamName">
                    {errorMessage => (
                      <div className="error">{errorMessage}</div>
                    )}
                  </ErrorMessage>
                </label>

                <div className="teamSearchArea">
                  <input
                    type="text"
                    placeholder="name/position/project name"
                    className="teamSearchInput"
                    onChange={this.handleSearch}
                  />
                  <button className="teamSearchButton">
                    <i className="fas fa-search" id="teamSearchIcon" />
                  </button>
                  <p className="teamSearchText">Search</p>
                </div>
                <button
                  type="submit"
                  className="edit"
                  id="submitTeamFormButton"
                >
                  Submit
                </button>
              </div>
              <table className="editTeamMembers">
                <caption className="row">
                  <ErrorMessage name="TeamLead">
                    {errorMessage => (
                      <div className="error">{errorMessage}</div>
                    )}
                  </ErrorMessage>
                  <ErrorMessage name="Employees">
                    {errorMessage => (
                      <div className="error">{errorMessage}</div>
                    )}
                  </ErrorMessage>
                </caption>
                <thead className="thead">
                  <tr className="row">
                    <th
                      className="theader"
                      onClick={this.toSortByName}
                      id={
                        this.state.sortByName
                          ? this.state.sortByName === "default"
                            ? null
                            : "empDesc"
                          : "empAsc"
                      }
                    >
                      Name
                    </th>
                    <th
                      className="theader"
                      onClick={this.toSortByPosition}
                      id={
                        this.state.sortByPosition
                          ? this.state.sortByPosition === "default"
                            ? null
                            : "empDesc"
                          : "empAsc"
                      }
                    >
                      Position
                    </th>
                    <th className="theader">Team Lead</th>
                    <th className="theader">Team members</th>
                  </tr>
                </thead>
                <tbody className="editEmployeeTableBody">
                  {filteredEmp.map(Employee => {
                    return (
                      <tr key={Employee.id} className="row">
                        <td className="cell">
                          {Employee.FirstName} {Employee.LastName}
                        </td>
                        <td className="cell">
                          {Employee.Position.PositionName}
                        </td>
                        <td className="cell">
                          <Field
                            type="radio"
                            name="TeamLead"
                            value={Employee.id}
                            checked={Employee.id === values.TeamLead}
                            onChange={event => {
                              setFieldValue("TeamLead", event.target.value);
                            }}
                          />
                        </td>
                        <td className="cell">
                          <Field
                            type="checkbox"
                            value={Employee.id}
                            name="Employees"
                            onChange={event => {
                              let newEmpIds;
                              if (
                                values.Employees.includes(event.target.value)
                              ) {
                                newEmpIds = values.Employees.filter(
                                  id => id !== event.target.value
                                );
                              } else {
                                newEmpIds = values.Employees.concat(
                                  event.target.value
                                );
                              }
                              setFieldValue("Employees", newEmpIds);
                            }}
                            checked={
                              values.Employees.indexOf(Employee.id) !== -1
                                ? true
                                : false
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <table className="editTeamProject">
                <caption>
                  <ErrorMessage name="Projects">
                    {errorMessage => (
                      <div className="error">{errorMessage}</div>
                    )}
                  </ErrorMessage>
                </caption>
                <thead className="thead">
                  <tr className="row">
                    <th className="theader">Project name</th>
                    <th className="theader">Project start date</th>
                    <th className="theader">Selected</th>
                  </tr>
                </thead>
                <tbody className="editProjectTableBody">
                  {filteredProject.map(Project => {
                    return (
                      <tr key={Project.id} className="row">
                        <td className="cell">{Project.ProjectName}</td>
                        <td className="cell">
                          {dayjs(parseInt(Project.ProjectStartDate))
                            .add(
                              dayjs(parseInt(Project.ProjectStartDate))
                                .toDate()
                                .getTimezoneOffset(),
                              "minute"
                            )
                            .format("YYYY-MM-DD")}
                        </td>
                        <td className="cell">
                          <Field
                            type="checkbox"
                            name="Projects"
                            value={Project.id}
                            checked={
                              values.Projects.indexOf(Project.id) !== -1
                                ? true
                                : false
                            }
                            onChange={event => {
                              let newProjectIds;
                              if (
                                values.Projects.indexOf(event.target.value) !==
                                -1
                              ) {
                                newProjectIds = values.Projects.filter(
                                  p => p !== event.target.value
                                );
                              } else {
                                newProjectIds = values.Projects.concat(
                                  event.target.value
                                );
                              }
                              setFieldValue("Projects", newProjectIds);
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Form>
          )}
        />
      </div>
    );
  }
}

export default compose(
  withRouter,
  graphql(createTeamMutation, { name: "createTeamMutation" }),
  graphql(employeesQuery, { name: "employeesQuery" }),
  graphql(projectsQuery, { name: "projectsQuery" }),
  graphql(teamsQuery, { name: "teamsQuery" })
)(newTeam);
