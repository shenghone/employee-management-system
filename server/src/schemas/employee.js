import Joi from "./joi";

const Email = Joi.string()
  .email()
  .required()
  .label("Email");

const Username = Joi.string()
  .alphanum()
  .min(3)
  .max(20);
const Password = Joi.string()
  //password has to be at least one lower case, one uppercase, one number, one special character and between 8 to 30 characters long
  .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,30}$/)
  .label("Password")
  .options({
    language: {
      string: {
        regex: {
          base:
            "Password must contains at least one lowercase letter, one uppercase letter, one number, one special character and between 8 to 30 characters long."
        }
      }
    }
  });
const FirstName = Joi.string()
  .min(1)
  .max(20)
  .label("FirstName");
const LastName = Joi.string()
  .min(1)
  .max(20)
  .label("LastName");
const AddressStreet = Joi.string()
  .min(5)
  .max(30)
  .label("ddressStreet");
const AddressState = Joi.string()
  .min(2)
  .max(10)
  .label("AddressState");
const AddressCity = Joi.string()
  .min(1)
  .max(20)
  .label("AddressCity");
const AddressZip = Joi.string()
  .min(5)
  .max(7)
  .label("Postal code/ZIP");
const Extension = Joi.number()
  .min(0)
  .max(9999)
  .label("Extension");
const SalaryBonus = Joi.number()
  .positive()
  .max(99999)
  .label("Salary bonus");

const Position = Joi.string().objectId();
const HireDate = Joi.string()
  .regex(/^((?:20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)
  .label("Hire date")
  .options({
    language: {
      string: {
        regex: {
          base: "Date is invalid. Must be in YYYY-MM-DD format."
        }
      }
    }
  });

const PhoneNum = Joi.string()
  .label("Phone number")
  .min(10)
  .max(15);

const id = Joi.string().objectId();

export const updateEmployee = Joi.object().keys({
  id,
  Username,
  FirstName,
  LastName,
  AddressStreet,
  AddressState,
  AddressCity,
  AddressZip,
  Position,
  Extension,
  SalaryBonus,
  PhoneNum,
  HireDate,
  Email
});

export const signUp = Joi.object().keys({
  Email,
  Username,
  Password,
  FirstName,
  LastName,
  AddressStreet,
  AddressState,
  AddressCity,
  AddressZip,
  Position,
  HireDate,
  Extension: Joi.number()
    .min(0)
    .max(9999)
    .label("Extension")
    .allow(null),
  PhoneNum
});

export const signIn = Joi.object().keys({
  Email,
  Password
});
