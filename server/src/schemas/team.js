import Joi from "./joi";

const TeamName = Joi.string()
  .trim()
  .min(2)
  .max(30)
  .label("Team Name");

const ProjectIds = Joi.array()
  .min(1)
  .max(10)
  .unique()
  .items(
    Joi.string()
      .objectId()
      .label("Project ID")
  )
  .label("Project IDs");

const EmployeeIds = Joi.array()
  .min(1)
  .unique()
  .items(
    Joi.string()
      .objectId()
      .label("Employee ID")
  )
  .label("Employee IDs");

const TeamLeadId = Joi.string()
  .objectId()
  .label("Team Lead")
  .error(
    new Error("Please make sure there is only ONE team lead with a valid ID.")
  );

const id = Joi.string()
  .objectId()
  .label("Team ID")
  .error(new Error("ID is not valid."));

export const createTeam = Joi.object().keys({
  TeamName,
  ProjectIds,
  EmployeeIds,
  TeamLeadId
});

export const updateTeam = Joi.object().keys({
  id,
  TeamName,
  ProjectIds,
  EmployeeIds,
  TeamLeadId
});
