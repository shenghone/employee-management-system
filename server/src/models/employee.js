import mongoose, { Schema } from "mongoose";
mongoose.set("useFindAndModify", false);
import { hash, compare } from "bcryptjs";

// create the employeeSchema
const employeeSchema = new mongoose.Schema(
  {
    FirstName: String,
    LastName: String,
    AddressStreet: String,
    AddressState: String,
    AddressCity: String,
    AddressZip: String,
    PhoneNum: String,
    Extension: Number,
    Position: { type: Schema.Types.ObjectId, ref: "Position" },
    HireDate: Date,
    SalaryBonus: Number,
    Username: {
      type: String,
      validate: {
        validator: Username => Employee.doesntExist({ Username }),
        message: ({ value: Username }) => `Username has already been taken.`
      }
    },
    Password: String,
    Email: {
      type: String,
      validate: {
        validator: Email => Employee.doesntExist({ Email }),
        message: ({ val: Email }) => `Email has already been taken.`
      }
    }
  },
  {
    timestamps: true
  }
);

employeeSchema.pre("save", async function() {
  if (this.isModified("Password")) {
    this.Password = await hash(this.Password, 10);
  }
});

employeeSchema.statics.doesntExist = async function(option) {
  return (await this.where(option).countDocuments()) === 0;
};

employeeSchema.methods.matchesPassword = function(Password) {
  return compare(Password, this.Password);
};

// make this schema available to the Node application
const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
