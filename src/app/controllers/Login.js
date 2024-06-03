import bcrypt from "bcrypt";

import { loginAccountValidate } from "../helper/validation.js";

import Account from "../models/account.js";

class LoginController {
  // [GET] /login
  get(req, res) {
    if (req.session.user) {
      res.json({ loggedIn: true, user: req.session.user });
    } else {
      res.json({ loggedIn: false });
    }
  }

  // [POST] /login
  async post(req, res) {
    try {
      let { username, password, remember } = req.body;
      username = username.trim().toLowerCase();
      password = password.trim();

      const { error } = loginAccountValidate({ username, password });
      if (error) {
        res.json(error.details[0]);
        return;
      }

      const user = await Account.findOne({
        $or: [{ email: username }, { username: username }],
      });

      if (user) {
        if (!user.verified) {
          res.send({
            message:
              "You have not verified your email. Please check your mailbox!!!",
          });
        } else {
          const validPassword = await bcrypt.compare(password, user.password);
          if (validPassword) {
            if (remember) req.session.cookie.maxAge *= 30;
            req.session.user = {
              username: user.username,
              _id: user._id,
              email: user.email,
              isAdmin: user.isAdmin,
            };
            res.json({
              loggedIn: true,
              user: req.session.user,
              message: "Successful login ><",
            });
          } else {
            res.json({ message: "Incorrect password :<" });
          }
        }
      } else {
        res.json({ message: "Account does not exist" });
      }
    } catch (err) {
      res.json({
        status: 500,
        message: "System error!!! Please notify the app developer immediately",
      });
    }
  }

  async delete(req, res) {
    req.session.destroy((err) => {
      if (err) {
        res.json({
          status: 500,
          message: "System error!!!",
        });
      } else {
        res.clearCookie("userId");
        res.json({
          status: 200,
          message: "Logout success!!!",
        });
      }
    });
  }
}

export default new LoginController();
