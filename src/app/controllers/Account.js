import Accounts from "../models/account.js";

class AccountController {
  // [GET] /login
  async getAll(req, res) {
    try {
      const data = await Accounts.find({});
      const filterPassword = data.map(
        ({ password, username, email, verified, isAdmin }) => ({
          username,
          email,
          verified,
          isAdmin,
        })
      );
      res.json({ data: filterPassword, status: 200 });
    } catch (error) {
      res.status(500).json({ err: error });
    }
  }

  // [POST] /login
  async post(req, res) {
    const email = req.params.email;

    try {
      await Accounts.findOne({ email }).updateOne({
        isAdmin: true,
      });
      res.json({ status: 200, message: "Update successfully" });
    } catch (error) {
      res.json({ status: 500, message: error });
    }
  }
}

export default new AccountController();
