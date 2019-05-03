import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import { withRouter } from "react-router-dom";
import SearchBar from "../searchBar/searchBar";
import { teamsQuery } from "../queries/queries";

import "./teams.css";

class teams extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInput: ""
    };
  }

  viewTeam = arg => {
    this.props.history.push(`/team/${arg}`);
  };

  addNewTeam = () => {
    this.props.history.push("/team/new");
  };

  search = arg => {
    this.setState({ userInput: arg });
  };
  render() {
    if (!this.props.teamsQuery || this.props.teamsQuery.loading) {
      return null;
    }

    const { Teams } = this.props.teamsQuery;

    let filteredTeams = Teams.filter(Team => {
      return (
        Team.TeamName.toUpperCase().indexOf(
          this.state.userInput.toUpperCase()
        ) !== -1 ||
        (Team.TeamLead.FirstName + " " + Team.TeamLead.LastName)
          .toUpperCase()
          .indexOf(this.state.userInput.toUpperCase()) !== -1
      );
    });
    return (
      <div className="tableWrapper">
        <button
          className="createNew"
          id="createNewTeamButton"
          onClick={() => {
            this.addNewTeam();
          }}
        >
          new team
        </button>
        <div className="teamSearchBar">
          <SearchBar
            displayedMessage={"team name/team lead"}
            search={this.search}
          />
        </div>

        <div className="outterWrapper">
          <table className="tableClass teamsTable">
            <thead className="tableHead ">
              <tr className="headRow">
                <th className="tableHeader teamNameWidth">Team Name</th>
                <th className="tableHeader teamLeadWidth">Team Lead</th>
                <th className="tableHeader projectdWidth">Projects</th>
                <th className="tableHeader teamMemberWidth">Team member</th>
              </tr>
            </thead>
            <tbody className="tableBody">
              {!this.props.teamsQuery || this.props.teamsQuery.loading ? (
                <tr>
                  <td>Data is loading...</td>
                </tr>
              ) : (
                filteredTeams.map(team => {
                  return (
                    <tr
                      key={team.id}
                      className="bodyRow"
                      onClick={() => {
                        this.viewTeam(team.id);
                      }}
                    >
                      <td className="tableContent teamNameWidth">
                        {team.TeamName}
                      </td>
                      <td className="tableContent teamLeadWidth">
                        {team.TeamLead.FirstName} {team.TeamLead.LastName}
                      </td>
                      <td className="tableContent projectsWidth">
                        <ul className="contentList">
                          {team.Projects.map(project => {
                            return (
                              <li key={project.id}>{project.ProjectName}</li>
                            );
                          })}
                        </ul>
                      </td>
                      <td className="tableContent teamMemberWidth">
                        <ul className="contentList">
                          {team.Employees.map((employee, index) => {
                            return (
                              <li key={index}>
                                {employee.FirstName} {employee.LastName}
                              </li>
                            );
                          })}
                        </ul>
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
  graphql(teamsQuery, { name: "teamsQuery" })
)(teams);
