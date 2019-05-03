import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import { withRouter } from "react-router-dom";
import { teamQuery } from "../../queries/queries";
import "./team.css";

class team extends Component {
  exitTeam = () => {
    this.props.history.push(`/teams`);
  };

  toEditTeam = () => {
    this.props.history.push(`/team/edit/${this.props.match.params.teamId}`);
  };

  render() {
    if (!this.props.teamQuery || this.props.teamQuery.loading) {
      return null;
    }
    const {
      id,
      TeamName,
      TeamLead,
      Projects,
      Employees
    } = this.props.teamQuery.Team;

    return (
      <div className="teamWrapper">
        <div className="statusBar" onClick={this.exitTeam} />
        <div className="teamInfoLeft">
          <h2 className="teamName">{TeamName}</h2>
          <div className="teamInfoBottom">
            <p className="teamId">{id}</p>
            <button
              className="edit"
              id="editTeamButton"
              onClick={this.toEditTeam}
            >
              edit
            </button>
          </div>
        </div>
        <div className="teamInfoRight">
          <div className="teamInfoBody">
            <div className="teamLead">
              <label className="teamLabel">lead</label>
              <p>{TeamLead.FirstName + " " + TeamLead.LastName}</p>
            </div>
            <div className="tempProjects">
              <label className="teamLabel">projects</label>
              {Projects.map((project, index) => {
                if (index !== Projects.length - 1) {
                  return (
                    <p key={project.id}>
                      {project.ProjectName}, {"\u00A0"}
                    </p>
                  );
                }
                return <p key={project.id}>{project.ProjectName}</p>;
              })}
            </div>
            <div className="teamEmployees">
              <label className="teamLabel">members</label>
              {Employees.map((employee, index) => {
                if (index !== Employees.length - 1) {
                  return (
                    <p key={employee.id}>
                      {employee.FirstName} {employee.LastName},{"\u00A0"}
                    </p>
                  );
                }
                return (
                  <p key={employee.id}>
                    {employee.FirstName} {employee.LastName}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  withRouter,
  graphql(teamQuery, {
    name: "teamQuery",
    options: props => {
      return {
        variables: {
          id: props.match.params.teamId
        }
      };
    }
  })
)(team);
