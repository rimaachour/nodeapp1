const roles = {
  admin: 1,
  user: 2,
};

const checkPermission = (role) => {
  return (req, res, next) => {
    const userRole = req.user.role;

    if (userRole < roles[role]) {
      return res.status(403).send({ error: "Forbidden" });
    }

    next();
  };
};
module.exports = { checkPermission };
