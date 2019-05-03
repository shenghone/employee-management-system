import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import dayjs from "dayjs";
import {
  teamQuery,
  projectsQuery,
  employeesQuery,
  updateTeamMutation,
  teamsQuery
} from "../../../queries/queries";
import { UpdateTeam } from "../../../schema/schema";
import "./teamForm.css";
import { Formik, Field, Form, ErrorMessage } from "formik";

class teamForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInput: "",
      sortByName: "default",
      sortByPosition: "default"
    };
  }

  exitTeamForm = () => {
    this.props.history.push(`/team/${this.props.match.params.teamId}`);
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
    let found;
    TeamsObj.map(t => {
      if (t.TeamName.toUpperCase() === name.toUpperCase()) {
        found = t;
      }
      return t;
    });
    return found;
  };

  render() {
    if (
      !this.props.teamQuery ||
      this.props.teamQuery.loading ||
      !this.props.employeesQuery ||
      this.props.employeesQuery.loading ||
      !this.props.projectsQuery ||
      this.props.projectsQuery.loading ||
      !this.props.updateTeamMutation ||
      this.props.updateTeamMutation.loading ||
      !this.props.teamsQuery ||
      this.props.teamsQuery.loading
    ) {
      return null;
    }
    const {
      id: TeamId,
      TeamName,
      TeamLead,
      Projects,
      Employees
    } = this.props.teamQuery.Team;

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
    const { updateTeamMutation } = this.props;
    const { Teams } = this.props.teamsQuery;

    return (
      <div className="editTeamWrapper">
        <div className="statusBar" onClick={this.exitTeamForm} />
        <div className="editTeamLeft">
          <div className="editTeamLeftAreas">
            <h2 className="teamFormTeamName">{TeamName}</h2>
            <p className="teamFormTeamId">
              Editing
              <br />
              {TeamId}
            </p>
          </div>
        </div>
        <Formik
          initialValues={{
            id: this.props.match.params.teamId,
            Employees: Employees.map(m => m.id),
            TeamName: TeamName,
            Projects: Projects.map(p => p.id),
            TeamLead: TeamLead.id
          }}
          validationSchema={UpdateTeam}
          onSubmit={(values, { setSubmitting }) => {
            const updatedTeam = updateTeamMutation({
              variables: {
                TeamName: values.TeamName,
                EmployeeIds: values.Employees,
                ProjectIds: values.Projects,
                TeamLeadId: values.TeamLead,
                id: values.id
              },
              refetchQueries: [
                {
                  query: teamQuery,
                  variables: { id: values.id }
                }
              ]
            });

            if (updatedTeam) {
              setSubmitting(false);
              this.exitTeamForm();
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
                  rename team
                  <br />
                  <Field
                    type="text"
                    name="TeamName"
                    className={!errors.TeamName ? "defaultInput" : "errorInput"}
                    value={values.TeamName}
                    onBlur={event => {
                      if (errors) {
                        if (errors.TeamName === "Name is taken") {
                          setFieldTouched("TeamName", true, false);
                          setFieldError("TeamName", "Name is taken");
                        } else {
                          setFieldTouched("TeamName", true, true);
                        }
                      }
                    }}
                    onChange={event => {
                      setFieldValue("TeamName", event.target.value, false);
                      const used = this.checkIfNameIsUsed(
                        Teams,
                        event.target.value
                      );
                      if (used) {
                        if (used.id === this.props.match.params.teamId) {
                          setFieldValue("TeamName", event.target.value);
                        } else {
                          setFieldError("TeamName", "Name is taken");
                          setFieldTouched("TeamName", true, false);
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
                  disabled={isSubmitting || !_.isEmpty(errors)}
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
  graphql(teamQuery, {
    options: props => {
      return {
        variables: {
          id: props.match.params.teamId
        }
      };
    },
    name: "teamQuery"
  }),
  graphql(employeesQuery, { name: "employeesQuery" }),
  graphql(projectsQuery, { name: "projectsQuery" }),
  graphql(updateTeamMutation, { name: "updateTeamMutation" }),
  graphql(teamsQuery, { name: "teamsQuery" })
)(teamForm);
