import { Team, Employee, Project } from "../models";
import Joi from "joi";
import { objectId, createTeam, updateTeam } from "../schemas";
import { UserInputError } from "apollo-server-express";

export default {
  Query: {
    Team: async (parent, args, { req }, info) => {
      await Joi.validate(args, objectId);
      return Team.findById(args.id);
    },
    Teams: async (parent, args, context, info) => {
      return Team.find({});
    }
  },
  Mutation: {
    CreateTeam: async (parent, args, { req }, info) => {
      const { TeamName, EmployeeIds, ProjectIds, TeamLeadId } = args;
      const EmployeeFound = await Employee.where("_id")
        .in(EmployeeIds)
        .countDocuments();
      const ProjectFound = await Project.where("_id")
        .in(ProjectIds)
        .countDocuments();
      const LeadFound = await Employee.where("_id")
        .in(TeamLeadId)
        .countDocuments();

      
      if (TeamLeadId && EmployeeIds) {
        EmployeeIds.map(EmployeeId => {
          if (TeamLeadId.indexOf(EmployeeId) !== -1) {
            throw new UserInputError(
              "Team leader cannot be a team member at the same time."
            );
          }
        });
      }

      if (EmployeeFound !== EmployeeIds.length) {
        throw new UserInputError("One or more Employee IDs are invalid.");
      } else if (ProjectFound !== ProjectIds.length) {
        throw new UserInputError("One or more Project IDs are invalid.");
      } else if (!LeadFound) {
        throw new UserInputError("Team Lead ID is invalid.");
      }
      await Joi.validate(args, createTeam, { abortEarly: false });
      const team = await Team.create({
        TeamName,
        Projects: ProjectIds,
        Employees: EmployeeIds,
        TeamLead: TeamLeadId
      });
      return team;
    },
    UpdateTeam: async (parent, args, context, info) => {
      const { TeamName, EmployeeIds, ProjectIds, TeamLeadId } = args;
      const EmployeeFound = await Employee.where("_id")
        .in(EmployeeIds)
        .countDocuments();
      const ProjectFound = await Project.where("_id")
        .in(ProjectIds)
        .countDocuments();
      const LeadFound = await Employee.where("_id")
        .in(TeamLeadId)
        .countDocuments();
      if (TeamLeadId && EmployeeIds) {
        EmployeeIds.map(EmployeeId => {
          if (TeamLeadId.indexOf(EmployeeId) !== -1) {
            throw new UserInputError(
              "Team leader cannot be a team member at the same time."
            );
          }
        });
      }

      if (EmployeeFound !== EmployeeIds.length) {
        throw new UserInputError("One or more Employee IDs are invalid.");
      } else if (ProjectFound !== ProjectIds.length) {
        throw new UserInputError("One or more Project IDs are invalid.");
      } else if (!LeadFound) {
        throw new UserInputError("Team Lead ID is invalid.");
      }
      await Joi.validate(args, updateTeam, { abortEarly: false });

      const team = await Team.findOneAndUpdate(
        { _id: args.id },
        {
          TeamName,
          TeamLead: TeamLeadId,
          Project: ProjectIds,
          Employees: EmployeeIds
        }
      );

      return team;
    }
  },

  TeamType: {
    Projects: async (team, args, context, info) => {
      await team.populate("Projects").execPopulate();
      return team.Projects;
    },
    TeamLead: async (team, args, context, info) => {
      await team.populate("TeamLead").execPopulate();
      return team.TeamLead;
    },
    Employees: async (team, args, context, info) => {
      await team.populate("Employees").execPopulate();
      return team.Employees;
    }
  }
};
