const { Schema, model } = require("mongoose");

const MongooseError = require("../../helpers/MongooseError");

const emailRegExp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const MIN_PASSWORD_LENGTH = 6;
const DEFAULT_THEME = "violet";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: emailRegExp,
      unique: true,
    },
    password: {
      type: String,
      minlength: MIN_PASSWORD_LENGTH,
      required: [true, "Password is required"],
    },

    theme: {
      type: String,
      enum: ["dark", "light", "violet"],
      default: DEFAULT_THEME,
    },

    avatarURL: { type: String },
    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", MongooseError);

const User = model("User", userSchema);

module.exports = User;
