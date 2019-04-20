import mongoose, { Schema } from "mongoose";
// create the teamSchema
const teamSchema = new mongoose.Schema({
  TeamName: {
    type: String,
    validate: {
      validator: TeamName => Team.doesntExist({ TeamName }),
      message: ({ value: TeamName }) => `Team name has already been taken.`
    }
  },
  Projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
  Employees: [{ type: Schema.Types.ObjectId, ref: "Employee" }],
  TeamLead: { type: Schema.Types.ObjectId, ref: "Employee" }
});

teamSchema.statics.doesntExist = async function(option) {
  return (await this.where(option).countDocuments()) === 0;
};

// make this schema available to the Node application
const Team = mongoose.model("Team", teamSchema);
export default Team;
