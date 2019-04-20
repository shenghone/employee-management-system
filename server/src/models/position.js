import mongoose, { Schema } from "mongoose";

// create the positionSchema
const positionSchema = new mongoose.Schema({
  PositionName: {
    type: String,
    validate: {
      validator: PositionName => Position.doesntExist({ PositionName }),
      message: ({ value: PositionName }) => `Position name has been taken.`
    }
  },
  PositionDescription: String,
  PositionBaseSalary: Number
});

positionSchema.statics.doesntExist = async function(option) {
  return (await this.where(option).countDocuments()) === 0;
};

// make this schema available to the Node application
const Position = mongoose.model("Position", positionSchema);
export default Position;
