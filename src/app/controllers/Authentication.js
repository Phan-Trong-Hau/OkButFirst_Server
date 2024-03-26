export const restrictToAdmins = (req, res, next) => {
  if (!req.session.user?.isAdmin) {
    return res
      .status(401)
      .send({ message: "Authorization header required", status: 401 });
  }

  next();
};
