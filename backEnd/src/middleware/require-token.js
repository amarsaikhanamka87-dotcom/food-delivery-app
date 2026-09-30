const JWT_SECRET = process.env.JWT_SECRET;

export const requireToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("token", token);

  if (!token) {
    res.status(400).json({ messege: "requiredToken" });
  }

  try {
    const user = await jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {}
};
