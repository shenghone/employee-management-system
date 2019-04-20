import React, { Component } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { graphql, compose } from "react-apollo";
import { withRouter } from "react-router-dom";
import { CreateProject } from "../../schema/schema";
import { createProjectMutation, projectsQuery } from "../../queries/queries";

import "./newProjectForm.css";

class newProjectForm extends Component {
  exitNewProjectForm = () => {
    this.props.history.push("/projects");
  };

  checkProjectName = (ProjectArray, val) => {
    let projectFound;
    ProjectArray.map(p => {
      if (p.ProjectName.toUpperCase() === val.toUpperCase()) {
        projectFound = p;
      }
      return p;
    });

    return projectFound;
  };

  render() {
    if (
      !this.props.createProjectMutation ||
      this.props.createProjectMutation.loading ||
      !this.props.projectsQuery ||
      this.props.projectsQuery.loading
    ) {
      return null;
    }
    const { createProjectMutation } = this.props;
    const { Projects } = this.props.projectsQuery;
    return (
      <div className="newProjectFormWrapper">
        <div
          className="statusBar"
          onClick={this.exitNewProjectForm}
          id="exitNewProjectFormWrapper"
        />
        <div className="newProjectFormLeft">
          <h2>New project</h2>
        </div>
        <div className="newProjectFormRight">
          <Formik
            initialValues={{
              ProjectName: "",
              ProjectStartDate: "",
              ProjectDescription: ""
            }}
            exitNewProjectForm={this.exitNewProjectForm}
            validationSchema={CreateProject}
            onSubmit={async (values, isSumitting) => {
              const newProject = await createProjectMutation({
                variables: {
                  ProjectName: values.ProjectName,
                  ProjectDescription: values.ProjectDescription,
                  ProjectStartDate: values.ProjectStartDate
                },
                refetchQueries: [
                  {
                    query: projectsQuery
                  }
                ]
              });
              if (newProject) {
                this.exitNewProjectForm();
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
              <Form className="newProjectForm">
                <label className="newProjectName">
                  Name
                  <Field
                    type="text"
                    name="ProjectName"
                    className={
                      !errors.ProjectName ? "defaultInput" : "errorInput"
                    }
                    placeholder="7-15 characters long"
                    onBlur={event => {
                      if (errors) {
                        if (errors.ProjectName === "Name is taken") {
                          setFieldTouched("ProjectName", true, false);
                        } else {
                          setFieldTouched("ProjectName", true);
                        }
                      }
                    }}
                    onChange={event => {
                      let projectFound;
                      setFieldValue("ProjectName", event.target.value, false);
                      projectFound = this.checkProjectName(
                        Projects,
                        event.target.value
                      );
                      if (projectFound) {
                        setFieldError("ProjectName", "Name is taken");
                      } else {
                        setFieldValue("ProjectName", event.target.value);
                      }
                    }}
                  />
                  <ErrorMessage name="ProjectName">
                    {errorMessage => (
                      <div className="error">{errorMessage}</div>
                    )}
                  </ErrorMessage>
                </label>
                <label className="newProjectDescription">
                  description
                  <Field
                    type="text"
                    name="ProjectDescription"
                    className={
                      !errors.ProjectDescription
                        ? "defaultTextarea"
                        : "errorInput"
                    }
                    id="newProjectFormTextarea"
                    component="textarea"
                    placeholder="20-150 characters long"
                  />
                  <ErrorMessage name="ProjectDescription">
                    {errorMessage => (
                      <div className="error">{errorMessage}</div>
                    )}
                  </ErrorMessage>
                </label>
                <div className="newProjectBottom">
                  <label className="newProjectStartDate">
                    start date
                    <Field
                      type="text"
                      name="ProjectStartDate"
                      className={
                        !errors.ProjectStartDate ? "defaultInput" : "errorInput"
                      }
                      placeholder="YYYY-MM-DD"
                    />
                    <ErrorMessage name="ProjectStartDate">
                      {errorMessage => (
                        <div className="error">{errorMessage}</div>
                      )}
                    </ErrorMessage>
                  </label>
                  <button
                    className="edit"
                    id="newProjectSubmitButton"
                    type="submit"
                  >
                    submit
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
  graphql(createProjectMutation, { name: "createProjectMutation" }),
  graphql(projectsQuery, { name: "projectsQuery" })
)(newProjectForm);
