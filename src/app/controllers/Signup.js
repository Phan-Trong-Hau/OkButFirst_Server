import "dotenv/config";

import accounts from "../models/account.js";
import { createAccountValidate } from "../helper/validation.js";
import { sendVerificationEmail } from "../../config/nodemailer/index.js";
import bcryptHash from "../../config/bcrypt/index.js";

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

        const hashPassword = await bcryptHash(password, res);
        const data = await accounts.create({
          username,
          email,
          password: hashPassword,
          isAdmin: false,
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
