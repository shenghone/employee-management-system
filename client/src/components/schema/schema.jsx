import * as Yup from "yup";

import { parseDate } from "../../util/util";

const dateFormat = /^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
Yup.addMethod(Yup.mixed, "notInEmp", function(array, message) {
  return this.test({
    message,
    name: "notInEmp",
    exclusive: true,
    params: { array },
    test(value) {
      return !this.resolve(array).includes(value);
    }
  });
});

const TeamName = Yup.string()
  .trim()
  .min(5, "minimum 5 characters")
  .max(20, "maximum 20 characters")
  .required("Required");
const Projects = Yup.array().min(1, "minimum of 1 project");
const Employees = Yup.array().min(1, "minimum of 1 member");
const TeamLead = Yup.string().notInEmp(
  Yup.ref("Employees"),
  "Team lead cannot also be a team member"
);

export const CreateTeam = Yup.object().shape({
  TeamName,
  Projects,
  Employees,
  TeamLead
});

export const UpdateTeam = Yup.object().shape({
  TeamName,
  Projects,
  Employees,
  TeamLead
});

export const CreateProject = Yup.object().shape({
  ProjectStartDate: Yup.string()
    .matches(dateFormat, "must be in YYYY-MM-DD format")
    .test("valid date", "invalid date", function(val) {
      if (!val) {
        return true;
      }
      return parseDate(val);
    })
    .required("Required"),
  ProjectName: Yup.string()
    .min(7, "minimum 7 characters long")
    .max(20, "maximum 20 characters long")
    .required("Required"),
  ProjectDescription: Yup.string()
    .trim()
    .test("word count", "Must be 20-150 words long", function(str) {
      if (str) {
        return 20 <= str.split(" ").length && str.split(" ").length <= 150;
      }
    })
    .required("Required")
});

export const UpdateProjectSchema = Yup.object().shape({
  ProjectName: Yup.string()
    .trim()
    .min(5, "minimum 5 characters long")
    .max(20, "maximum 20 characters long")
    .required("Required"),
  ProjectDescription: Yup.string().test(
    "word count",
    "Must be 20-150 words long",
    function(str) {
      if (str) {
        return 20 <= str.split(" ").length && str.split(" ").length <= 150;
      }
    }
  ),
  prevStartDate: Yup.string()
    .matches(dateFormat, "must be in YYYY-MM-DD format and a valid date")
    .test("valid date", "invalid date", function(val) {
      if (!val) {
        return true;
      }
      return parseDate(val);
    })
    .required("Required"),
  prevEndDate: Yup.string()
    .notRequired()
    .matches(dateFormat, "must be in YYYY-MM-DD format and a valid date")
    .test("valid date", "invalid date", function(val) {
      if (!val) {
        return true;
      }
      return parseDate(val);
    })
});

const AddressStreet = Yup.string()
  .min(5, "minimum 5 characters")
  .max(30, "maximum 20 characters")
  .required("Required");

const AddressState = Yup.string()
  .min(2, "minimum 5 characters")
  .max(10, "maximum 10 characters")
  .required("Required");

const AddressCity = Yup.string()
  .min(2, "minimum 2 characters")
  .max(15, "maximum 15 characters")
  .required("Required");

const AddressZip = Yup.string()
  .min(5, "minimum 5 characters")
  .max(7, "maximum 7 characters")
  .required("Required");

const Position = Yup.string().required();

const FirstName = Yup.string()
  .min(2, "minimum 2 characters")
  .max(15, "maximum 15 characters")
  .required("Required");

const LastName = Yup.string()
  .min(2, "minimum 2 characters")
  .max(15, "maximum 15 characters")
  .required("Required");

const HireDate = Yup.string()
  .matches(dateFormat, "must be in YYYY-MM-DD format and a valid date")
  .test("valid date", "invalid date", function(val) {
    return parseDate(val);
  })
  .required("Required");

const PhoneNum = Yup.string()
  .min(10, "minimum of 10 numbers")
  .max(15, "maximum of 15 characters and numbers")
  .required("Required");

const Username = Yup.string()
  .min(5, "minimum of 5 characters long")
  .max(10, "maxinum of 10 characters long")
  .test("no space", "cannot contain space", function(val) {
    if (val) {
      if (val.length > 0) {
        return val.indexOf(" ") === -1;
      }
    }
    return true;
  })
  .required("required");

const Email = Yup.string()
  .email("Must be a valid email")
  .required("required");
export const UpdateEmployeeSchema = Yup.object().shape({
  AddressStreet,
  AddressState,
  AddressCity,
  Extension: Yup.number()
    .min(0)
    .max(9999)
    .required("Required"),
  AddressZip,

  Position: Yup.string().required("Required"),
  FirstName,
  LastName,
  HireDate,
  PhoneNum,
  id: Yup.string().required(),
  Username,
  SalaryBonus: Yup.number()
    .max(99999, "maxnimum 99999")
    .nullable(),
  Email
});

const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,30}$/;

export const SingUpSchema = Yup.object().shape({
  FirstName,
  LastName,
  AddressStreet,
  AddressState,

  AddressCity,
  AddressZip,
  Email,
  Username,
  Position,
  PhoneNum,
  PositionName: Yup.string().required("Required"),
  HireDate: Yup.string()
    .matches(dateFormat, "must be in YYYY-MM-DD format and a valid date")
    .test("valid date", "invalid date", function(val) {
      if (val) {
        return parseDate(val);
      } else {
        return false;
      }
    }),
  Password: Yup.string()
    .matches(
      passwordRegex,
      "minimum of one lower case, one uppercase, one number, one special character and between 8 to 30 characters long"
    )
    .required("Required"),
  Extension: Yup.number()

    .min(0, "must be in between 0-9999")
    .max(9999, "must be in between 0-9999")
    .nullable()
});
