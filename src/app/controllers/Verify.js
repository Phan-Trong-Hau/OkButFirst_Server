import bcrypt from "bcrypt";

import accounts from "../models/account.js";
import verification from "../models/verification.js";

class VerifyController {
  // [GET] /login
  get(req, res) {
    res.send("Get router verify");
  }

  // [POST] /login
  post(req, res) {}

  getSlug(req, res) {
    const { userId, uniqueString } = req.params;
    verification
      .findOne({ userId })
      .then((data) => {
        if (data) {
          const { expiresAt } = data;
          const hashUniqueString = data.uniqueString;

          if (expiresAt < Date.now()) {
            verification
              .deleteOne({ userId })
              .then((data) => {
                accounts
                  .deleteOne({ _id: userId })
                  .then((data) =>
                    res.send("The link has expired. Please register again!")
                  )
                  .catch((err) =>
                    res.send(
                      "There was an error while deleting an expired account!"
                    )
                  );
              })
              .catch((err) =>
                res.send(
                  "There was an error during the process of deleting expired account authentication data!"
                )
              );
          } else {
            bcrypt
              .compare(uniqueString, hashUniqueString)
              .then((data) => {
                if (data) {
                  accounts
                    .updateOne({ _id: userId }, { verified: true })
                    .then((data) => {
                      verification
                        .deleteOne({ userId })
                        .then((data) =>
                          res.send(
                            "You have successfully authenticated your email."
                          )
                        )
                        .catch((err) =>
                          res.send("Error while deleting user id!")
                        );
                    })
                    .catch((err) =>
                      res.send("Error during email authentication!")
                    );
                } else {
                  res.send("Email authentication failed!");
                }
              })
              .catch((err) =>
                res.send("There was an error during data translation!")
              );
          }
        } else {
          res.send("No account found to authenticate!!!");
        }
      })
      .catch((err) => res.send("Error while finding user id!!!"));
  }
}

export default new VerifyController();
