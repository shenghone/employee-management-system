import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import { withRouter } from "react-router-dom";
import { employeeQuery } from "../../queries/queries";
import dayjs from "dayjs";

import "./employee.css";

class employee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedEmployee: this.props.match.params.employeeId
    };
  }

  toEditEmployee = arg => {
    this.props.history.push(`/employee/edit/${arg}`);
  };

  render() {
    console.log(this.props.match.params.employeeId);
    console.log(this.state.selectedEmployee);

    if (!this.props.employeeQuery || this.props.employeeQuery.loading) {
      return null;
    }
    const {
      FirstName,
      LastName,
      AddressStreet,
      AddressState,
      AddressCity,
      AddressZip,
      Email,
      PhoneNum,
      Extension,
      HireDate,
      SalaryBonus,
      id
    } = this.props.employeeQuery.Employee;
    const { PositionName } = this.props.employeeQuery.Employee.Position;
    return (
      <div className="employeeWrapper">
        <div
          className="statusBar"
          onClick={() => {
            this.props.history.push(`/employees`);
          }}
        />
        <div className="infoLeft">
          <div className="employeeName">
            {FirstName} <br />
            {LastName}
          </div>
          <button
            onClick={() => {
              this.toEditEmployee(this.state.selectedEmployee);
            }}
            id="employeeEditButton"
            className="edit"
          >
            Edit
          </button>
        </div>
        <div className="infoRight">
          <p>
            <b>ID:</b> {id}
          </p>
          <p>
            <b>Position:</b> {PositionName}
          </p>
          <p>
            <b>Address:</b> {AddressStreet} {AddressCity} {AddressState}{" "}
            {AddressZip}
          </p>
          <p>
            <b>Email:</b> {Email}
          </p>

          <p>
            <b>Phone number:</b> {PhoneNum}
          </p>
          <p>
            <b>Extension:</b> {Extension}
          </p>
          <p>
            <b>Hire date:</b>
            {dayjs(parseInt(HireDate))
              .add(
                dayjs(parseInt(HireDate))
                  .toDate()
                  .getTimezoneOffset(),
                "minute"
              )
              .format("YYYY-MMM-DD")}
          </p>
          <p>
            <b>Salary bonus:</b> {SalaryBonus}
          </p>
        </div>
      </div>
    );
  }
}

export default compose(
  withRouter,
  graphql(employeeQuery, {
    name: "employeeQuery",
    options: props => {
      return {
        variables: {
          id: props.selectedEmployee || props.match.params.employeeId
        }
      };
    }
  })
)(employee);
