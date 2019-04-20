import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import { employeesQuery } from "../queries/queries";
import dayjs from "dayjs";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import SearchBar from "../searchBar/searchBar";
import "./employees.css";

class employees extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedEmployee: null,
      visibility: false,
      userInput: "",
      sortByName: "default",
      sortByPosition: "default",
      sortByHireDate: "default"
    };
  }

  search = arg => {
    this.setState({ userInput: arg });
  };

  changeVisibilityFromChild = arg => {
    this.setState({ visibility: arg });
  };

  toViewEmployee = arg => {
    return this.props.history.push(`/employee/${arg}`);
  };

  toSortByName = () => {
    this.setState({
      sortByName: !this.state.sortByName,
      sortByPosition: "default",
      sortByHireDate: "default"
    });
  };

  toSoryByPosition = () => {
    this.setState({
      sortByPosition: !this.state.sortByPosition,
      sortByName: "default",
      sortByHireDate: "default"
    });
  };

  toSortByHireDate = () => {
    this.setState({
      sortByPosition: "default",
      sortByName: "default",
      sortByHireDate: !this.state.sortByHireDate
    });
  };

  backToDefault = () => {
    this.setState({
      sortByPosition: "default",
      sortByName: "default",
      sortByHireDate: "default"
    });
  };

  render() {
    if (!this.props.data || this.props.data.loading) {
      return null;
    }

    const { data } = this.props;
    let filteredEmployee = this.props.data.Employees.filter(Employee => {
      return (
        Employee.FirstName.toUpperCase().indexOf(
          this.state.userInput.toUpperCase()
        ) !== -1 ||
        Employee.LastName.toUpperCase().indexOf(
          this.state.userInput.toUpperCase()
        ) !== -1 ||
        (
          Employee.FirstName.toUpperCase() +
          " " +
          Employee.LastName.toUpperCase()
        ).indexOf(this.state.userInput.toUpperCase()) !== -1 ||
        Employee.Position.PositionName.toUpperCase().indexOf(
          this.state.userInput.toUpperCase()
        ) !== -1
      );
    });

    const { sortByName, sortByPosition, sortByHireDate } = this.state;
    if (sortByName === true) {
      filteredEmployee = _.sortBy(filteredEmployee, "FirstName");
    } else if (sortByName === false) {
      filteredEmployee = _.sortBy(filteredEmployee, "FirstName").reverse();
    }

    if (sortByPosition === true) {
      filteredEmployee = _.sortBy(filteredEmployee, function(emp) {
        return emp.Position.PositionName;
      });
    } else if (sortByPosition === false) {
      filteredEmployee = _.sortBy(filteredEmployee, function(emp) {
        return emp.Position.PositionName;
      }).reverse();
    }

    if (sortByHireDate === true) {
      filteredEmployee = _.sortBy(filteredEmployee, function(emp) {
        return dayjs(emp.HireDate);
      });
    } else if (sortByHireDate === false) {
      filteredEmployee = _.sortBy(filteredEmployee, function(emp) {
        return dayjs(emp.HireDate);
      }).reverse();
    }

    return (
      <div className="tableWrapper">
        <div className="employeeSearchBar">
          <SearchBar
            userInput={this.state.userInput}
            displayedMessage={"search by name/position"}
            search={this.search}
          />
        </div>

        <div className="outterWrapper">
          <table className="tableClass">
            <thead className="tableHead">
              <tr className="headRow">
                <th
                  className="tableHeader employeeFullName"
                  onClick={this.toSortByName}
                  id={
                    this.state.sortByName === "default"
                      ? null
                      : this.state.sortByName === true
                      ? "sorting-asc"
                      : "sorting-desc"
                  }
                >
                  Name
                </th>
                <th
                  className="tableHeader employeePosition"
                  onClick={this.toSoryByPosition}
                  id={
                    this.state.sortByPosition === "default"
                      ? null
                      : this.state.sortByPosition === true
                      ? "sorting-asc"
                      : "sorting-desc"
                  }
                >
                  Position
                </th>
                <th
                  className="tableHeader employeeHireDate"
                  onClick={this.toSortByHireDate}
                  id={
                    sortByHireDate === "default"
                      ? null
                      : sortByHireDate === true
                      ? "sortingDate-asc"
                      : "sortingDate-desc"
                  }
                >
                  Hire Date
                </th>
                <th
                  className="tableHeader employeeAddress"
                  onClick={this.backToDefault}
                >
                  Address
                </th>
              </tr>
            </thead>
            <tbody className="tableBody">
              {!data || data.loading ? (
                <tr>
                  <td>Data is loading...</td>
                </tr>
              ) : (
                filteredEmployee.map(emp => {
                  return (
                    <tr
                      key={emp.id}
                      className="bodyRow"
                      onClick={() => {
                        this.toViewEmployee(emp.id);
                      }}
                    >
                      <td className="tableContent employeeFullName">
                        {emp.FirstName} {emp.LastName}
                      </td>
                      <td className="tableContent employeePosition">
                        {emp.Position.PositionName}
                      </td>
                      <td className="tableContent employeeHireDate">
                        {dayjs(parseInt(emp.HireDate))
                          .add(
                            dayjs(parseInt(emp.HireDate))
                              .toDate()
                              .getTimezoneOffset(),
                            "minute"
                          )
                          .format("YYYY-MM-DD")}
                      </td>
                      <td className="tableContent employeeAddress">
                        {emp.AddressStreet} {emp.AddressCity} {emp.AddressState}{" "}
                        {emp.AddressZip}
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
  graphql(employeesQuery)
)(employees);
