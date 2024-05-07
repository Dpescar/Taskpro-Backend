const nodemailer = require("nodemailer");

const { OUTLOOK_EMAIL, OUTLOOK_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "smtp.office365.com",
  port: 465,
  secure: false,
  auth: {
    user: OUTLOOK_EMAIL,
    pass: OUTLOOK_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(nodemailerConfig);

async function sendEmail(data) {
  try {
    const email = {
      ...data,
      from: OUTLOOK_EMAIL,
      to: "roxanapascaru@gmail.com",
    };
    await transporter.sendMail(email);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

module.exports = sendEmail;
