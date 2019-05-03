import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import {
  projectQuery,
  updateProjectMutation,
  projectsQuery
} from "../../../queries/queries";
import { UpdateProjectSchema } from "../../../schema/schema";
import { withRouter } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import dayjs from "dayjs";
import "./projectForm.css";

class projectForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectId: this.props.match.params.projectId,
      prevEndDate:
        this.props.ProjEndDate === undefined ? "" : this.props.ProjEndDate
    };
  }

  exitProjectForm = () => {
    this.props.history.push(`/project/${this.state.projectId}`);
  };
  checkProjectName = (ProjectArray, val) => {
    let projectNameFound;
    ProjectArray.map(p => {
      if (p.ProjectName.toUpperCase() === val.toUpperCase()) {
        projectNameFound = p;
      }
      return p;
    });
    return projectNameFound;
  };

  render() {
    if (
      !this.props.projectQuery ||
      this.props.projectQuery.loading ||
      !this.props.projectsQuery ||
      this.props.projectQuery.loading
    ) {
      return null;
    }
    const { Projects } = this.props.projectsQuery;

    const {
      id,
      ProjectDescription,
      ProjectStartDate,
      ProjectEndDate,
      ProjectName
    } = this.props.projectQuery.Project;
    const { updateProjectMutation } = this.props;

    return (
      <div className="projectFormWrapper">
        <div className="statusBar" onClick={this.exitProjectForm} />
        <div className="projectFormLeft">
          <h2>{ProjectName}</h2>
          <p>
            {id} <br /> editing
          </p>
        </div>
        <Formik
          exitProjectForm={this.exitProjectForm}
          initialValues={{
            id: id,
            prevStartDate: dayjs(parseInt(ProjectStartDate))
              .add(
                dayjs(parseInt(ProjectStartDate))
                  .toDate()
                  .getTimezoneOffset(),
                "minute"
              )
              .format("YYYY-MM-DD"),
            ProjectName: ProjectName,
            ProjectDescription: ProjectDescription,
            prevEndDate: ProjectEndDate
              ? dayjs(parseInt(ProjectEndDate))
                  .add(
                    dayjs(parseInt(ProjectEndDate))
                      .toDate()
                      .getTimezoneOffset(),
                    "minute"
                  )
                  .format("YYYY-MM-DD")
              : ""
          }}
          validationSchema={UpdateProjectSchema}
          onSubmit={async (values, { setSubmitting }) => {
            const updatedProject = await updateProjectMutation({
              variables: {
                id: values.id,
                ProjectName: values.ProjectName,
                ProjectDescription: values.ProjectDescription,
                ProjectStartDate: values.prevStartDate,
                ProjectEndDate: values.prevEndDate
              },
              refetchQueries: [
                {
                  query: projectQuery,
                  variables: { id: values.id }
                }
              ]
            });

            if (updatedProject) {
              this.exitProjectForm();
              setSubmitting(false);
            }
          }}
          render={({
            errors,
            values,
            isSubmitting,
            setFieldValue,
            setFieldError,
            setFieldTouched,
            prevStartDate
          }) => (
            <Form className="projectFormRight">
              <label name="renameProject" className="renameProject">
                rename project
                <br />
                <Field
                  type="text"
                  name="ProjectName"
                  className={
                    !errors.ProjectName ? "defaultInput" : "errorInput"
                  }
                  onBlur={event => {
                    if (errors) {
                      if (errors.ProjectName === "Name is taken") {
                        setFieldError("ProjectName", "Name is taken");
                        setFieldTouched("ProjectName", true, false);
                      } else {
                        setFieldTouched("ProjectName", true);
                      }
                    } else {
                      setFieldTouched("ProjectName", true);
                    }
                  }}
                  onChange={event => {
                    setFieldValue("ProjectName", event.target.value, false);
                    const used = this.checkProjectName(
                      Projects,
                      event.target.value
                    );
                    if (used) {
                      if (used.id === this.props.match.params.projectId) {
                        setFieldValue("ProjectName", event.target.value);
                      } else {
                        setFieldError("ProjectName", "Name is taken");
                        setFieldTouched("ProjectName", true, false);
                      }
                    } else {
                      setFieldValue("ProjectName", event.target.value);
                    }
                  }}
                />
                <ErrorMessage name="ProjectName">
                  {errorMessage => <div className="error">{errorMessage}</div>}
                </ErrorMessage>
              </label>
              <label
                name="projectDescription"
                className="ProjectDescription"
                id="editProjectDescription"
              >
                Project description
                <br />
                <Field
                  component="textarea"
                  name="ProjectDescription"
                  className={
                    !errors.ProjectDescription
                      ? "defaultTextarea"
                      : "errorInput"
                  }
                />
                <ErrorMessage name="ProjectDescription">
                  {errorMessage => <div className="error">{errorMessage}</div>}
                </ErrorMessage>
              </label>
              <div className="projectBottomArea">
                <label name="projectStartDate" className="ProjectStartDate">
                  start date
                  <br />
                  <Field
                    type="text"
                    name="prevStartDate"
                    className={
                      !errors.prevStartDate ? "defaultInput" : "errorInput"
                    }
                  />
                  <ErrorMessage name="prevStartDate">
                    {errorMessage => (
                      <div className="error">{errorMessage}</div>
                    )}
                  </ErrorMessage>
                </label>
                <label name="projectEndDate" className="ProjectEndDate">
                  end date
                  <br />
                  <Field
                    type="text"
                    name="prevEndDate"
                    className={
                      !errors.prevEndDate ? "defaultInput" : "errorInput"
                    }
                  />
                  <ErrorMessage name="prevEndDate">
                    {errorMessage => (
                      <div className="error">{errorMessage}</div>
                    )}
                  </ErrorMessage>
                </label>

                <button
                  type="submit"
                  className="edit"
                  id="projectSubmitButton"
                  disabled={errors ? true : false}
                >
                  Submit
                </button>
              </div>
            </Form>
          )}
        />
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
  }),
  graphql(projectsQuery, { name: "projectsQuery" }),
  graphql(updateProjectMutation, { name: "updateProjectMutation" })
)(projectForm);
