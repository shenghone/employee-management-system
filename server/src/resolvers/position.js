import { Position } from "../models";
import { createPosition, updatePosition } from "../schemas";
import Joi from "joi";

export default {
  Query: {
    Position: async (parent, args, context, info) => {
      await Joi.validate(args, objectId);
      return Position.findById(args.id);
    },
    Positions: (parent, args, context, info) => {
      return Position.find({});
    }
  },
  Mutation: {
    CreatePosition: async (parent, args, context, info) => {
      await Joi.validate(args, createPosition);
      const position = await Position.create(args);
      return position;
    },
    UpdatePosition: async (parent, args, context, info) => {
      const { PositionName, PositionDescription, PositionBaseSalary } = args;
      await Joi.validate(args, updatePosition);

      const updatedPosition = await Position.findOneAndUpdate(
        { _id: args.id },
        {
          PositionName,
          PositionDescription,
          PositionBaseSalary
        }
      );
      return updatedPosition;
    }
  }
};
