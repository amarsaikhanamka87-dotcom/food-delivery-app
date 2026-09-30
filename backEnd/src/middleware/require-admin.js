const JWT_SECRET = process.env.JWT_SECRET;

export const requireAdmin = (req, res, next) => {
  const user = req.user;

  if (user.role !== "admin") {
    res.status(400).json({ messege: "admin only" });
  } else next();
};
