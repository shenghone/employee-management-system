import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import { projectQuery } from "../../queries/queries";
import { withRouter } from "react-router-dom";
import dayjs from "dayjs";
import "./project.css";

class project extends Component {
  startEditingProject = () => {
    this.props.history.push(
      `/project/edit/${this.props.match.params.projectId}`
    );
  };

  toExit = () => {
    this.props.history.push(`/projects`);
  };

  render() {
    if (!this.props.projectQuery || this.props.projectQuery.loading) {
      return null;
    }
    const {
      ProjectName,
      ProjectDescription,
      ProjectStartDate,
      ProjectEndDate
    } = this.props.projectQuery.Project;
    return (
      <div className="projectWrapper">
        <div className="statusBar" onClick={this.toExit} />
        <div className="projectLeft">
          <h2>{ProjectName}</h2>

          <button
            onClick={() => {
              this.startEditingProject();
            }}
            className="edit"
            id="projectEditButton"
          >
            Edit
          </button>
        </div>
        <div className="projectRight">
          <p className="projectDescription">
            <b className="projectLabel">Project description</b> <br />
            {ProjectDescription}
          </p>
          <div className="projectDate">
            <p className="projectStartDate">
              <b className="projectLabel">Start date</b>
              {dayjs(parseInt(ProjectStartDate))
                .add(
                  dayjs(parseInt(ProjectStartDate))
                    .toDate()
                    .getTimezoneOffset(),
                  "minute"
                )
                .format("YYYY-MM-DD")}
            </p>
            <p className="projectEndDate">
              <b className="projectLabel">End date</b>
              {ProjectEndDate
                ? dayjs(parseInt(ProjectEndDate))
                    .add(
                      dayjs(parseInt(ProjectEndDate))
                        .toDate()
                        .getTimezoneOffset(),
                      "minute"
                    )
                    .format("YYYY-MM-DD")
                : "-"}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  withRouter,
  graphql(projectQuery, {
    name: "projectQuery",
    options: props => {
      return {
        variables: {
          id: props.match.params.projectId
        }
      };
    }
  })
)(project);
