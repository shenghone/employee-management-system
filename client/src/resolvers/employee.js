import { Employee, Position } from "../models";
import Joi from "joi";
import { attemptSignIn, signOut } from "../auth";
import { signUp, signIn, objectId, updateEmployee } from "../schemas";
import { UserInputError } from "apollo-server-express";

export default {
  Query: {
    Me: (parent, args, { req }, info) => {
      return Employee.findById(req.session.employeeId);
    },
    Employees: (parent, args, context, info) => {
      return Employee.find({});
    },
    Employee: async (parent, args, context, info) => {
      await Joi.validate(args, objectId);
      return Employee.findById(args.id);
    },
    EmployeeEmails: (parent, args, contenxt, info) => {
      return Employee.find({}, "Email");
    }
  },
  Mutation: {
    SignUp: async (parent, args, { req }, info) => {
      await Joi.validate(args, signUp, { abortEarly: false });
      const employee = await Employee.create(args);
      req.session.employeeId = employee.id;
      return employee;
    },
    SignIn: async (parent, args, { req }, info) => {
      const { employeeId } = req.session;
      const { Email, Password } = args;
      await Joi.validate(args, signIn, { abortEarly: false });
      const employee = await attemptSignIn(args.Email, args.Password);
      req.session.employeeId = employee.id;

      return employee;
    },
    SignOut: (parent, args, { req, res }, info) => {
      return signOut(req, res);
    },
    UpdateEmployee: async (parent, args, { req, res }, info) => {
      await Joi.validate(args, updateEmployee, { abortEarly: false });
      let Used;
      const UsernameFound = await Employee.findOne(
        { Username: args.Username },
        "id",
        function(err, employee) {
          if (employee) {
            if (employee.id !== args.id) {
              Used = -1;
            }
          }
        }
      );
      if (Used) {
        throw new UserInputError("Username has been taken.");
      }

      const PositionFound = await Position.findOne({ _id: args.Position });
      if (!PositionFound) {
        throw new UserInputError(
          "Please select from the available position list."
        );
      }
      const employee = Employee.findByIdAndUpdate(
        { _id: args.id },
        { ...args }
      );
      return employee;
    }
  },
  EmployeeType: {
    Position: async (employee, args, context, info) => {
      await employee.populate("Position").execPopulate();

      return employee.Position;
    }
  }
};
