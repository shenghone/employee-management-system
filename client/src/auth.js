import { AuthenticationError } from "apollo-server-express";
import { Employee } from "./models";

export const attemptSignIn = async (email, password) => {
  try {
    const message = "Incorrect email/password. Please try again.";

    const employee = await Employee.findOne({ Email: email });
    if (!employee) {
      throw new AuthenticationError(message);
    }
    if (!(await employee.matchesPassword(password))) {
      throw new AuthenticationError(message);
    }
    return employee;
  } catch (err) {
    console.error(err);
  }
};

export const ensureSignIn = req => {
  if (!req.session.employeeId) {
    throw new AuthenticationError("You must sign in to proceed.");
  }
};

export const ensureSignOut = req => {
  if (req.session.employeeId) {
    throw new AuthenticationError("You are already signed in.");
  }
};

export const signOut = (req, res) =>
  new Promise((resolve, reject) => {
    req.session.destroy(err => {
      if (err) reject(err);
      res.clearCookie(process.env.SESS_NAME);
      resolve(true);
    });
  });
