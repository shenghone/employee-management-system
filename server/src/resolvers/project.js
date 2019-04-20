import { Project } from "../models";
import { createProject, updateProject, objectId } from "../schemas";
import Joi from "joi";

export default {
  Query: {
    Project: async (parent, args, { req }, info) => {
      await Joi.validate(args, objectId);
      return Project.findById(args.id);
    },
    Projects: (parent, args, { req }, info) => {
      return Project.find({});
    }
  },
  Mutation: {
    CreateProject: async (parent, args, { req }, info) => {
      await Joi.validate(args, createProject);
      const project = await Project.create(args);
      return project;
    },
    UpdateProject: async (parent, args, { req }, info) => {
      await Joi.validate(args, updateProject);
      
      const newProject = await Project.findOneAndUpdate(
        { _id: args.id },
        {
          ProjectName: args.ProjectName,
          ProjectDescription: args.ProjectDescription,
          ProjectStartDate: args.ProjectStartDate,
          ProjectEndDate: args.ProjectEndDate
        }
      );
      return newProject;
    }
  }
};
