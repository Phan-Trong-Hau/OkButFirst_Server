export const restrictToAdmins = (req, res, next) => {
  if (req.session.user?.role !== "admin") {
    return res
      .status(401)
      .send({ message: "Authorization header required", status: 401 });
  }

  next();
};
