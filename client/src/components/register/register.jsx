import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import { withRouter, Redirect } from "react-router-dom";
import { SingUpSchema } from "../schema/schema";
import {
  signUpMutation,
  employeeEmailsQuery,
  positionsQuery
} from "../queries/queries";
import { Formik, Field, Form, ErrorMessage } from "formik";
import "./register.css";

class register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultAuth: props.defaultAuth
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.defaultAuth !== prevState.defaultAuth) {
      return { defaultAuth: nextProps.defaultAuth };
    } else {
      return null;
    }
  }

  backToMain = () => {
    this.props.history.push("/");
  };

  checkEmail = (emailArray, email) => {
    if (emailArray.includes(email)) {
      return true;
    } else {
      return false;
    }
  };

  render() {
    const { defaultAuth } = this.state;
    if (
      !this.props.employeeEmailsQuery ||
      this.props.employeeEmailsQuery.loading ||
      !this.props.positionsQuery ||
      this.props.positionsQuery.loading ||
      !this.props.signUpMutation ||
      this.props.signUpMutation.loading
    ) {
      return null;
    }

    const { EmployeeEmails } = this.props.employeeEmailsQuery;
    const { Positions } = this.props.positionsQuery;

    let EmailsArray = EmployeeEmails.filter(e => e.Email).map(e => e.Email);

    if (defaultAuth) {
      return <Redirect to="/" />;
    } else {
      return (
        <div className="registerWrapper">
          <div className="statusBar" onClick={this.backToMain} />
          <div className="registerLeft">
            <h2>new employee</h2>
          </div>

          <Formik
            EmailsArray
            initialValues={{
              Email: "",
              Password: "",
              FirstName: "",
              LastName: "",
              AddressStreet: "",
              AddressCity: "",
              AddressZip: "",
              AddressState: "",
              Position: "",
              Username: "",
              HireDate: "",
              Extension: "",
              PhoneNum: "",
              PositionName: ""
            }}
            validationSchema={SingUpSchema}
            onSubmit={async (values, setSubmitting) => {
              const newEmployee = await this.props.signUpMutation({
                variables: {
                  FirstName: values.FirstName,
                  LastName: values.LastName,
                  Position: values.Position,
                  Extension: values.Extension === "" ? null : values.Extension,
                  HireDate: values.HireDate,
                  PhoneNum: values.PhoneNum,
                  AddressStreet: values.AddressStreet,
                  AddressCity: values.AddressCity,
                  AddressState: values.AddressState,
                  AddressZip: values.AddressZip,
                  Password: values.Password,
                  Username: values.Username,
                  Email: values.Email
                }
              });
              if (newEmployee) {
                this.props.changeAuthStatus(true);
                this.props.history.push("/");
              }
            }}
            render={({
              errors,
              values,
              status,
              isSubmitting,
              setFieldValue,
              setFieldError,
              setFieldTouched
            }) => (
              <Form className="newEmployeeForm">
                <label id="employeeEmail">
                  Email
                  <Field
                    name="Email"
                    className={
                      !errors.Email ? "newEmployeeInput" : "errorInput"
                    }
                    type="text"
                    onBlur={event => {
                      if (errors) {
                        if (errors.Email === "Email is taken") {
                          setFieldError("Email", "Email is taken");
                          setFieldTouched("Email", true, false);
                        }
                      }
                    }}
                    onChange={event => {
                      const Used = this.checkEmail(
                        EmailsArray,
                        event.target.value
                      );
                      if (Used === true) {
                        console.log("Didn't Pass");
                        setFieldError("Email", "Email is taken");
                        setFieldTouched("Email", true, false);
                      } else {
                        setFieldValue("Email", event.target.value, true);
                      }
                    }}
                  />
                  <ErrorMessage name="Email">
                    {errorMessage => (
                      <div className="error">{errorMessage}</div>
                    )}
                  </ErrorMessage>
                </label>
                <label id="employeePassword">
                  Password
                  <Field
                    name="Password"
                    className={
                      !errors.Password ? "newEmployeeInput" : "errorInput"
                    }
                    type="password"
                  />
                  <ErrorMessage name="Password">
                    {errorMessage => (
                      <div className="error">{errorMessage}</div>
                    )}
                  </ErrorMessage>
                </label>
                <label id="employeeUsername">
                  Username
                  <Field
                    name="Username"
                    className={
                      !errors.Username ? "newEmployeeInput" : "errorInput"
                    }
                    type="text"
                  />
                  <ErrorMessage name="Username">
                    {errorMessage => (
                      <div className="error">{errorMessage}</div>
                    )}
                  </ErrorMessage>
                </label>
                <label id="employeeAddressStreet">
                  Street
                  <Field
                    name="AddressStreet"
                    className={
                      !errors.Email ? "newEmployeeInput" : "errorInput"
                    }
                    type="text"
                  />
                  <ErrorMessage name="AddressStreet">
                    {errorMessage => (
                      <div className="error">{errorMessage}</div>
                    )}
                  </ErrorMessage>
                </label>
                <label id="employeeAddressCity">
                  City
                  <Field
                    name="AddressCity"
                    className={
                      !errors.AddressCity ? "newEmployeeInput" : "errorInput"
                    }
                    type="text"
                  />
                  <ErrorMessage name="AddressCity">
                    {errorMessage => (
                      <div className="error">{errorMessage}</div>
                    )}
                  </ErrorMessage>
                </label>
                <label id="employeeAddressState">
                  state/province
                  <Field
                    name="AddressState"
                    className={
                      !errors.AddressState ? "newEmployeeInput" : "errorInput"
                    }
                    type="text"
                  />
                  <ErrorMessage name="AddressState">
                    {errorMessage => (
                      <div className="error">{errorMessage}</div>
                    )}
                  </ErrorMessage>
                </label>
                <label id="employeeAddressZip">
                  Zip/Postal code
                  <Field
                    name="AddressZip"
                    className={
                      !errors.AddressZip ? "newEmployeeInput" : "errorInput"
                    }
                    type="text"
                  />
                  <ErrorMessage name="AddressZip">
                    {errorMessage => (
                      <div className="error">{errorMessage}</div>
                    )}
                  </ErrorMessage>
                </label>
                <label id="employeePhoneNum">
                  Phone number
                  <Field
                    name="PhoneNum"
                    className={
                      !errors.PhoneNum ? "newEmployeeInput" : "errorInput"
                    }
                    type="text"
                  />
                  <ErrorMessage name="PhoneNum">
                    {errorMessage => (
                      <div className="error">{errorMessage}</div>
                    )}
                  </ErrorMessage>
                </label>
                <label id="employeeHireDate">
                  Hire date
                  <Field
                    name="HireDate"
                    className={
                      !errors.HireDate ? "newEmployeeInput" : "errorInput"
                    }
                    type="text"
                  />
                  <ErrorMessage name="HireDate">
                    {errorMessage => (
                      <div className="error">{errorMessage}</div>
                    )}
                  </ErrorMessage>
                </label>
                <label id="employeeFirstName">
                  First name
                  <Field
                    name="FirstName"
                    className={
                      !errors.FirstName ? "newEmployeeInput" : "errorInput"
                    }
                    type="text"
                  />
                  <ErrorMessage name="FirstName">
                    {errorMessage => (
                      <div className="error">{errorMessage}</div>
                    )}
                  </ErrorMessage>
                </label>
                <label id="employeeLastName">
                  Last name
                  <Field
                    name="LastName"
                    className={
                      !errors.LastName ? "newEmployeeInput" : "errorInput"
                    }
                    type="text"
                  />
                  <ErrorMessage name="LastName">
                    {errorMessage => (
                      <div className="error">{errorMessage}</div>
                    )}
                  </ErrorMessage>
                </label>

                <label id="employeePosition">
                  Position
                  <Field
                    name="PositionName"
                    className={
                      !errors.PositionName ? "newEmployeeInput" : "errorInput"
                    }
                    type="text"
                    readOnly
                  />
                  <ul className="employeePositions">
                    {Positions.map(p => {
                      return (
                        <li
                          className="employeePositionList"
                          key={p.id}
                          value={p.id}
                          onClick={e => {
                            setFieldValue("PositionName", p.PositionName);
                            setFieldValue("Position", p.id);
                          }}
                        >
                          {p.PositionName}
                        </li>
                      );
                    })}
                  </ul>
                  <ErrorMessage name="Position">
                    {errorMessage => (
                      <div className="error">{errorMessage}</div>
                    )}
                  </ErrorMessage>
                </label>
                <label id="employeeExtension">
                  Extension*
                  <Field
                    name="Extension"
                    className={
                      !errors.Extension ? "newEmployeeInput" : "errorInput"
                    }
                    type="number"
                  />
                  <ErrorMessage name="Extension">
                    {errorMessage => (
                      <div className="error">{errorMessage}</div>
                    )}
                  </ErrorMessage>
                </label>
                <p id="optional">* optional</p>
                <button className="edit" id="newEmployeeButton" type="submit">
                  submit
                </button>
              </Form>
            )}
          />
        </div>
      );
    }
  }
}

export default compose(
  withRouter,
  graphql(positionsQuery, { name: "positionsQuery" }),
  graphql(employeeEmailsQuery, { name: "employeeEmailsQuery" }),
  graphql(signUpMutation, { name: "signUpMutation" })
)(register);
