const { Schema, model } = require("mongoose");
const MongooseError = require("../../helpers/MongooseError");

const dashboardSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    backgroundURL: {
      type: String,
      default: null,
    },
    icon: {
      type: String,
      default: "",
    },
    currentDashboard: {
      type: Boolean,
      default: false,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { versionKey: false, timestamps: true, strictPopulate: false }
);

dashboardSchema.post("save", MongooseError);

const Dashboard = model("Dashboard", dashboardSchema);

module.exports = Dashboard;
