const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const HttpError = require("../helpers/HttpError");
const sendEmail = require("../helpers/sendEmail");
const wrapControllerFunction = require("../helpers/decorators");
const crypto = require("crypto");
const fs = require("fs");
const jimp = require("jimp");

const { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } = process.env;

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

async function register(req, res) {
  try {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "Email is already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const avatarURL = "";

    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
      confirmationToken: generateToken(),
      avatarURL,
    });

    const confirmationLink = `http://localhost:3000/confirm?token=${newUser.confirmationToken}`;

    const emailData = {
      to: email,
      subject: "Registration Confirmation",
      text: `Welcome to our site! Please confirm your registration by clicking the following link: ${confirmationLink}`,
      html: `<p>Welcome to our site! Please <a href="${confirmationLink}">confirm your registration</a>.</p>`,
    };

    await sendEmail(emailData);
    console.log("Confirmation email sent successfully.");

    res.status(201).json({
      email: newUser.email,
      message:
        "Registration successful! Please check your email to confirm your account.",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user" });
  }
}
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send("Email or password is wrong");
    }
    const payload = { id: user._id };

    const accessToken = jwt.sign(payload, ACCESS_TOKEN_KEY, {
      expiresIn: "10m",
    });
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_KEY, {
      expiresIn: "7d",
    });

    await User.findByIdAndUpdate(user._id, { accessToken, refreshToken });
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      theme: user.theme,
      avatarURL: user.avatarURL,
    };

    res.status(200).json({
      accessToken,
      refreshToken,
      user: userData,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login error" });
  }
}
async function refresh(req, res) {
  const { refreshToken: token } = req.body;
  try {
    const { id } = jwt.verify(token, REFRESH_TOKEN_KEY);
    const user = await User.findOne({ refreshToken: token });
    if (!user) {
      return res.status(404).send("Token invalid");
    }
    const payload = {
      id,
    };
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_KEY, {
      expiresIn: "10m",
    });
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_KEY, {
      expiresIn: "7d",
    });
    await User.findByIdAndUpdate(id, { accessToken, refreshToken });

    res.json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Refresh error:", error);
    res.status;
  }
}
async function getCurrent(req, res) {
  try {
    const { _id, name, email, theme, avatarURL } = req.user;

    if (!_id || !name || !email || !theme) {
      return res.status(401).send("User data incomplete");
    }

    res.status(200).json({
      user: {
        _id,
        name,
        email,
        theme,
        avatarURL,
      },
    });
  } catch (error) {
    console.error("Extracting current user error:", error);
    res.status(500).send("Extracting current user error");
  }
}

async function logout(req, res) {
  try {
    const { id } = req.user;
    await User.findByIdAndUpdate(id, { accessToken: "", refreshToken: "" });
    res.status(204).json({ message: "You have successfully logged out " });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Logout error" });
  }
}
async function updateTheme(req, res) {
  const { _id } = req.user;
  const result = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
    select: "-password -createdAt -updatedAt",
  });
  res.json(result);
}

async function updateProfile(req, res) {
  const { _id } = req.user;

  //   if (!req.file && !req.body.name && !req.body.email && !req.body.password) {
  //     throw HttpError(400, "Enter the data for changes");
  //   }

  //   if (!req.file && !req.body.password) {
  //     const result = await User.findByIdAndUpdate(_id, req.body, {
  //       new: true,
  //       select: "-password -createdAt -updatedAt",
  //     });
  //     res.json(result);
  //     return;
  //   }

  //   if (!req.body.password) {
  //     const upload = req.file.path;
  //     const result = await User.findByIdAndUpdate(
  //       _id,
  //       {
  //         ...req.body,
  //         avatarURL: upload,
  //       },
  //       { new: true, select: "-password -createdAt -updatedAt" }
  //     );
  //     res.json(result);
  //     return;
  //   }

  if (!req.file) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const result = await User.findByIdAndUpdate(
      _id,
      {
        ...req.body,
        password: hashedPassword,
      },
      { new: true, select: "-password -createdAt -updatedAt" }
    );
    res.json(result);
    return;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const upload = req.file.path;

  const result = await User.findByIdAndUpdate(
    _id,
    {
      ...req.body,
      password: hashedPassword,
      avatarURL: upload,
    },
    { new: true, select: "-password -createdAt -updatedAt" }
  );
  res.json(result);
}

async function getHelpEmail(req, res) {
  const { email, comment } = req.body;

  const helpReq = {
    to: "taskpro.project@gmail.com",
    subject: "User need help",
    html: `<p> Email: ${email}, Comment: ${comment}</p>`,
  };
  await sendEmail(helpReq);
  const helpRes = {
    to: email,
    subject: "Support",
    html: `<p>Thank you for you request! We will consider your comment ${comment}</p>`,
  };
  await sendEmail(helpRes);

  res.json({
    message: "Reply email sent",
  });
}
module.exports = {
  register: wrapControllerFunction(register),
  login: wrapControllerFunction(login),
  getCurrent: wrapControllerFunction(getCurrent),
  logout: wrapControllerFunction(logout),
  updateTheme: wrapControllerFunction(updateTheme),
  updateProfile: wrapControllerFunction(updateProfile),
  getHelpEmail: wrapControllerFunction(getHelpEmail),
  refresh: wrapControllerFunction(refresh),
  generateToken,
};
