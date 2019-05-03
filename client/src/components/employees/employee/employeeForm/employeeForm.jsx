import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import {
  employeeQuery,
  positionsQuery,
  updateEmployeeMutation
} from "../../../queries/queries";
import { withRouter } from "react-router-dom";
import { UpdateEmployeeSchema } from "../../../schema/schema";
import { Formik, Field, Form, ErrorMessage } from "formik";
import dayjs from "dayjs";
import "./employeeForm.css";

class employeeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentEmployee: this.props.match.params.employeeId,
      formVisibility: this.props.formVisibility
    };
  }

  exitEmployeeForm = () => {
    this.props.history.push(`/employee/${this.state.currentEmployee}`);
  };

  render() {
    if (
      !this.props.employeeQuery ||
      this.props.employeeQuery.loading ||
      !this.props.positionsQuery ||
      this.props.positionsQuery.loading
    ) {
      return null;
    }
    const {
      id,
      FirstName,
      LastName,
      AddressStreet,
      AddressCity,
      AddressState,
      AddressZip,
      Extension,
      PhoneNum,
      HireDate,
      Username,
      SalaryBonus,
      Email
    } = this.props.employeeQuery.Employee;

    const { PositionName } = this.props.employeeQuery.Employee.Position;
    const { Positions } = this.props.positionsQuery;
    const { updateEmployeeMutation } = this.props;
    return (
      <div className="employeeFormWrapper">
        <div className="statusBar" onClick={this.exitEmployeeForm} />
        <div className="employeeFormLeft">
          <h2 className="employeeFormName">
            {FirstName} <br />
            {LastName}
          </h2>
          <br />
          <p className="id">
            {id}
            <br />
            editing
          </p>
        </div>
        <div className="employeeFormRight">
          <Formik
            exitEmployeeForm={this.exitEmployeeForm}
            initialValues={{
              id,
              FirstName,
              LastName,
              AddressStreet,
              AddressCity,
              AddressState,
              AddressZip,
              Extension: parseInt(Extension),
              Username: Username ? Username : "",
              PhoneNum,
              HireDate: dayjs(parseInt(HireDate))
                .add(
                  dayjs(parseInt(HireDate))
                    .toDate()
                    .getTimezoneOffset(),
                  "minute"
                )
                .format("YYYY-MM-DD"),
              Position: this.props.employeeQuery.Employee.Position.id,
              Positions,
              PositionName,
              SalaryBonus,
              Email: Email ? Email : ""
            }}
            validationSchema={UpdateEmployeeSchema}
            onSubmit={async (values, { setSubmitting }) => {
              const newEmp = await updateEmployeeMutation({
                variables: {
                  id,
                  AddressCity: values.AddressCity,
                  AddressStreet: values.AddressStreet,
                  AddressZip: values.AddressZip,
                  AddressState: values.AddressState,
                  Extension: values.Extension,
                  Position: values.Position,
                  SalaryBonus: values.SalaryBonus,
                  PhoneNum: values.PhoneNum,
                  Username: values.Username,
                  Email: values.Email,
                  HireDate: values.HireDate,
                  FirstName: values.FirstName,
                  LastName: values.LastName
                },
                refetchQueries: [
                  {
                    query: employeeQuery,
                    variables: { id: id }
                  }
                ]
              });
              if (newEmp) {
                setSubmitting(false);
                this.exitEmployeeForm();
              }
            }}
            render={({
              errors,
              values,
              status,
              touched,
              isSubmitting,
              setFieldValue
            }) => (
              <Form className="updateEmployeeFormRight">
                <div className="updateEmployeeFormBody">
                  <label
                    className="updateAddressStreet"
                    id="updateAddressStreet"
                  >
                    street
                    <Field
                      type="text"
                      name="AddressStreet"
                      className={
                        !errors.AddressStreet ? "defaultInput" : "errorInput"
                      }
                    />
                    <ErrorMessage name="AddressStreet">
                      {errorMessage => (
                        <div className="error">{errorMessage}</div>
                      )}
                    </ErrorMessage>
                  </label>
                  <label className="updateAddressCity" id="updateAddressCity">
                    city
                    <Field
                      type="text"
                      name="AddressCity"
                      className={
                        !errors.AddressCity ? "defaultInput" : "errorInput"
                      }
                    />
                    <ErrorMessage name="AddressCity">
                      {errorMessage => (
                        <div className="error">{errorMessage}</div>
                      )}
                    </ErrorMessage>
                  </label>
                  <label className="updateAddressState" id="updateAddressState">
                    state
                    <Field
                      type="text"
                      name="AddressState"
                      className={
                        !errors.AddressState ? "defaultInput" : "errorInput"
                      }
                    />
                    <ErrorMessage name="AddressCity">
                      {errorMessage => (
                        <div className="error">{errorMessage}</div>
                      )}
                    </ErrorMessage>
                  </label>
                  <label className="updateAddressZip" id="updateAddressZip">
                    ZIP/postal code
                    <Field
                      type="text"
                      name="AddressZip"
                      className={
                        !errors.AddressZip ? "defaultInput" : "errorInput"
                      }
                    />
                    <ErrorMessage name="AddressZip">
                      {errorMessage => (
                        <div className="error">{errorMessage}</div>
                      )}
                    </ErrorMessage>
                  </label>
                  <label className="updateHireDate" id="updateHireDate">
                    hire date
                    <Field
                      type="text"
                      name="HireDate"
                      className={
                        !errors.HireDate ? "defaultInput" : "errorInput"
                      }
                    />
                    <ErrorMessage name="HireDate">
                      {errorMessage => (
                        <div className="error">{errorMessage}</div>
                      )}
                    </ErrorMessage>
                  </label>
                  <label className="updateSalaryBonus" id="updateSalaryBonus">
                    Salary bonus
                    <Field
                      type="number"
                      name="SalaryBonus"
                      className={
                        !errors.SalaryBonus ? "defaultInput" : "errorInput"
                      }
                    />
                    <ErrorMessage name="SalaryBonus">
                      {errorMessage => (
                        <div className="error">{errorMessage}</div>
                      )}
                    </ErrorMessage>
                  </label>
                  <label className="updatePhoneNum" id="updatePhoneNum">
                    Phone number
                    <Field
                      type="text"
                      name="PhoneNum"
                      className={
                        !errors.PhoneNum ? "defaultInput" : "errorInput"
                      }
                    />
                    <ErrorMessage name="PhoneNum">
                      {errorMessage => (
                        <div className="error">{errorMessage}</div>
                      )}
                    </ErrorMessage>
                  </label>

                  <label className="updateExtension" id="updateExtension">
                    Extension
                    <Field
                      type="number"
                      name="Extension"
                      className={
                        !errors.Extension ? "defaultInput" : "errorInput"
                      }
                    />
                    <ErrorMessage name="Extension">
                      {errorMessage => (
                        <div className="error">{errorMessage}</div>
                      )}
                    </ErrorMessage>
                  </label>
                  <label className="updateUsername" id="updateUsername">
                    Username
                    <Field
                      type="text"
                      name="Username"
                      className={
                        !errors.Username ? "defaultInput" : "errorInput"
                      }
                    />
                    <ErrorMessage name="Username">
                      {errorMessage => (
                        <div className="error">{errorMessage}</div>
                      )}
                    </ErrorMessage>
                  </label>
                  <label className="updateEmail" id="updateEmail">
                    Email
                    <Field
                      type="text"
                      name="Email"
                      className={!errors.Email ? "defaultInput" : "errorInput"}
                    />
                    <ErrorMessage name="Email">
                      {errorMessage => (
                        <div className="error">{errorMessage}</div>
                      )}
                    </ErrorMessage>
                  </label>
                  <label className="updatePosition" id="updatePosition">
                    Position
                    <Field
                      type="text"
                      name="PositionName"
                      className="defaultInput"
                      readOnly
                    />
                    <ul className="list">
                      {Positions.map(position => {
                        return (
                          <li
                            onClick={() => {
                              setFieldValue(
                                "PositionName",
                                position.PositionName
                              );
                              setFieldValue("Position", position.id);
                            }}
                            key={position.id}
                            value={position.id}
                          >
                            {position.PositionName}
                          </li>
                        );
                      })}
                    </ul>
                  </label>
                  <button
                    type="submit"
                    className="edit"
                    id="updateEmployeeFormButton"
                  >
                    Submit
                  </button>
                </div>
              </Form>
            )}
          />
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
          id: props.match.params.employeeId
        }
      };
    }
  }),
  graphql(positionsQuery, { name: "positionsQuery" }),
  graphql(updateEmployeeMutation, { name: "updateEmployeeMutation" })
)(employeeForm);
