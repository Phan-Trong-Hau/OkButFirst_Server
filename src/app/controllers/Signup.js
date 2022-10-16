import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { v4 } from "uuid";
import "dotenv/config";

import accounts from "../models/account.js";
import verification from "../models/verification.js";
import { createAccountValidate } from "../helper/validation.js";

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

const bcryptData = async (data) => {
    try {
        const salt = await bcrypt.genSalt(12);
        const hashData = await bcrypt.hash(data, salt);
        return hashData;
    } catch (error) {
        res.json({
            status: 500,
            message: "Data encryption error ;<",
        });
    }
};

const sendVerificationEmail = ({ _id, email, username }, res) => {
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
                                message:
                                    "There was an error sending the verification email ;<",
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

class SignupController {
    // [GET] /Signup
    get(req, res) {
        res.send("Get router Signup");
    }

    // [POST] /Signup
    async post(req, res) {
        // config data
        let { username, email, password, confirmPassword } = req.body;
        username = username.trim().toLowerCase();
        email = email.trim().toLowerCase();
        password = password.trim();
        confirmPassword = confirmPassword.trim();

        const { error } = createAccountValidate({
            username,
            email,
            password,
            confirmPassword,
        });

        if (error) {
            res.send(error.details[0].message);
        } else {
            try {
                const [usernameExist, emailExist] = await Promise.all([
                    accounts.findOne({ username }),
                    accounts.findOne({ email }),
                ]);

                if (usernameExist) {
                    res.send("Username is already taken.");
                    return;
                }
                if (emailExist) {
                    res.send("Email is already taken.");
                    return;
                }
                let role = "user";
                if (process.env.USERNAME_ADMINISTRATOR === username)
                    role = "admin";

                const hashPassword = await bcryptData(password);
                const data = await accounts.create({
                    username,
                    email,
                    password: hashPassword,
                    role,
                    verified: false,
                });

                sendVerificationEmail(data, res);
            } catch (err) {
                res.json({
                    status: 500,
                    message:
                        "System error!!! Please notify the app developer immediately",
                });
            }
        }
    }
}

export default new SignupController();
