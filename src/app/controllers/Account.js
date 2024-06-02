import Accounts from "../models/account.js";

class AccountController {
  // [GET] /login
  async getAll(req, res) {
    try {
      const data = await Accounts.find({});
      const filterPassword = data.map(
        ({ _id, username, email, verified, isAdmin }) => ({
          _id,
          username,
          email,
          verified,
          isAdmin,
        })
      );
      res.json(filterPassword);
    } catch (error) {
      res.status(500).json({ err: error });
    }
  }

  // [POST] /login
  async put(req, res) {
    const email = req.params.email;
    const { isAdmin } = req.body;
    try {
      const result = await Accounts.findOne({ email }).updateOne({
        isAdmin: isAdmin,
      });
      console.log({ result });

      res.json({ status: 200, message: "Update successfully" });
    } catch (error) {
      res.json({ status: 500, message: error });
    }
  }
}

export default new AccountController();
