import Joi from "./joi";

const PositionBaseSalary = Joi.number()
  .integer()
  .min(0)
  .max(999999)
  .label("Position base salary")
  .error(new Error("Base salary must be an integer value between 0-999,999"));

const PositionName = Joi.string()
  .min(5)
  .max(30)
  .label("Position name");

const PositionDescription = Joi.string()
  .min(10)
  .max(200)
  .label("Position description");

const id = Joi.string()
  .objectId()
  .label("Position ID");

export const updatePosition = Joi.object().keys({
  id,
  PositionName,
  PositionBaseSalary,
  PositionDescription
});

export const createPosition = Joi.object().keys({
  PositionName,
  PositionBaseSalary,
  PositionDescription
});
