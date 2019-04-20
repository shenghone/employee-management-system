import mongoose, { Schema } from "mongoose";

// create the projectSchema
const projectSchema = new Schema(
  {
    ProjectName: {
      type: String,
      validate: {
        validator: ProjectName => Project.doesntExist({ ProjectName }),
        message: ({ value: ProjectName }) =>
          `Project name has already been taken.`
      }
    },
    ProjectDescription: String,
    ProjectStartDate: Date,
    ProjectEndDate: Date
  },
  {
    timestamps: true
  }
);

projectSchema.statics.doesntExist = async function(option) {
  return (await this.where(option).countDocuments()) === 0;
};

// make this schema available to the Node application
const Project = mongoose.model("Project", projectSchema);
export default Project;
