import { v4 } from "uuid";
import nodemailer from "nodemailer";
import verification from "../../app/models/verification.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Login for Email successfully!!!");
  }
});

export const sendVerificationEmail = ({ _id, email, username }, res) => {
  const currentUrl = process.env.URL_BACKEND;
  const uniqueString = v4() + _id;

  const mailOptions = {
    from: `OK BUT FIRST COFFEE ${process.env.AUTH_EMAIL}`,
    to: email,
    subject: "Verify Your Email",
    html: `
        <h3>Dear ${username}</h3>
        <p>Verify your email address to complete the signup and login into your account.</p>
        <p>This link <b>expires in 15 minute</b>.</p>
        <h4>Press <a href=${
          currentUrl + "/auth/user/verify/" + _id + "/" + uniqueString
        }>here</a> to proceed.</h4>`,
  };

  bcryptData(uniqueString)
    .then((data) => {
      verification
        .create({
          userId: _id,
          uniqueString: data,
          expiresAt: Date.now() + 900000,
        })
        .then((data) => {
          transporter
            .sendMail(mailOptions)
            .then((data) =>
              res.send(
                "You have successfully registered an account. Please check your mailbox for email confirmation!!!"
              )
            )
            .catch((err) =>
              res.json({
                status: 500,
                message: "There was an error sending the verification email ;<",
              })
            );
        })
        .catch((err) =>
          res.json({
            status: 500,
            message:
              "There was an error while generating email authentication data ;<",
          })
        );
    })
    .catch((err) =>
      res.json({
        status: 500,
        message: "There was an error in the translation process ;<",
      })
    );
};
