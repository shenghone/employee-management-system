import Joi from "./joi";

const ProjectName = Joi.string()
  .min(2)
  .max(20)
  .label("Project name");

const ProjectDescription = Joi.string()
  .min(20)
  .max(10000)
  .label("Project description");

const ProjectStartDate = Joi.string()
  .length(10)
  .label("Project start date");

const ProjectEndDate = Joi.string()
  .allow("")
  .max(10)
  .label("Project end date");

const id = Joi.string()
  .objectId()
  .label("Object ID");

export const createProject = Joi.object().keys({
  ProjectName,
  ProjectDescription,
  ProjectStartDate
});

export const updateProject = Joi.object().keys({
  id,
  ProjectName,
  ProjectDescription,
  ProjectStartDate,
  ProjectEndDate
});
