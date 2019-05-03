import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import dayjs from "dayjs";
import SearchBar from "../searchBar/searchBar";

import { projectsQuery } from "../queries/queries";
import { withRouter } from "react-router-dom";

import "./projects.css";

class projects extends Component {
  state = {
    userInput: ""
  };

  selectProject = projectId => {
    this.setState({ selectedProject: projectId });
  };

  toViewProject = arg => {
    this.props.history.push(`/project/${arg}`);
  };

  createNewProject = () => {
    this.props.history.push("/project/new");
  };

  search = arg => {
    this.setState({ userInput: arg });
  };

  render() {
    if (!this.props.projectsQuery || this.props.projectsQuery.loading) {
      return null;
    }

    let filteredProjects = this.props.projectsQuery.Projects.filter(project => {
      return (
        project.ProjectName.toUpperCase().indexOf(
          this.state.userInput.toUpperCase()
        ) !== -1 ||
        project.ProjectDescription.toUpperCase().indexOf(
          this.state.userInput.toUpperCase()
        ) !== -1
      );
    });

    return (
      <div className="tableWrapper">
        <div className="searchBarArea">
          <SearchBar
            displayedMessage={"search by name/description"}
            className="projectSearchBar"
            search={this.search}
          />
        </div>

        <button
          className="createNew"
          id="createNewProjectButton"
          onClick={() => {
            this.createNewProject();
          }}
        >
          new project
        </button>
        <div className="outterWrapper">
          <table className="tableClass">
            <thead className="tableHead">
              <tr className="headRow">
                <th className="tableHeader projectNameWidth">Project name</th>
                <th
                  className="tableHeader projectDescriptionWidth"
                  id="projectD"
                >
                  Project description
                </th>
                <th className="tableHeader projectStartDateWidth">
                  Project start date
                </th>
                <th className="tableHeader projectEndDateWidth">
                  Project end date
                </th>
              </tr>
            </thead>
            <tbody className="tableBody">
              {!this.props.projectsQuery || this.props.projectsQuery.loading ? (
                <tr>
                  <td>Data is loading...</td>
                </tr>
              ) : (
                filteredProjects.map(project => {
                  return (
                    <tr
                      key={project.id}
                      className="bodyRow"
                      onClick={() => {
                        this.toViewProject(project.id);
                      }}
                    >
                      <td className="tableContent projectNameWidth">
                        {project.ProjectName}
                      </td>
                      <td className="tableContent projectDescriptionWidth">
                        {project.ProjectDescription}
                      </td>
                      <td className="tableContent projectStartDateWidth">
                        {dayjs(parseInt(project.ProjectStartDate))
                          .add(
                            dayjs(parseInt(project.ProjectStartDate))
                              .toDate()
                              .getTimezoneOffset(),
                            "minute"
                          )
                          .format("YYYY-MM-DD")}
                      </td>
                      <td className="tableContent projectEndDateWidth">
                        {project.ProjectEndDate
                          ? dayjs(parseInt(project.ProjectEndDate))
                              .add(
                                dayjs(parseInt(project.ProjectEndDate))
                                  .toDate()
                                  .getTimezoneOffset(),
                                "minute"
                              )
                              .format("YYYY-MM-DD")
                          : "-"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default compose(
  withRouter,
  graphql(projectsQuery, { name: "projectsQuery" })
)(projects);
