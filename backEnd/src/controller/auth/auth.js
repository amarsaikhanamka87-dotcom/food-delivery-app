import { User } from "../../model/userShema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const publicUser = (user) => {
  return {
    email: user.email,
    role: user.role,
    _id: user.id,
  };
};

const createToken = (user) => {
  console.log("user", user);
  return jwt.sign({ email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });
};

// SIGHUP ~HASH
export const signUpController = async (req, res) => {
  const SALT_ROUND = 10;

  const { password, email } = req.body;
  console.log("email", email);

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUND);
    const user = await User.create({ email: email, password: hashedPassword });

    const token = createToken(user);
    console.log("token", token);

    res.status(200).json({ messange: "Success", user, token: token });
  } catch (err) {
    res.status(500).json({ messange: err.message });
  }
};

//  LOGIN.  ~COMPARE
export const loginController = async (req, res) => {
  const { password, email } = req.body;

  console.log("reqBodyfghjkl;lkjhbnjklkjbhjkolkjhb", req.body);

  const user = await User.findOne({ email });

  console.log(user.password, "paassswooorddd");

  try {
    const passMatching = await bcrypt.compare(password, user.password);

    if (!passMatching) {
      res.status(400).json({ message: "Wrong password" });
    }
    res.status(200).json({ messange: "Success loginController", user });
  } catch (err) {
    res.status(500).json({ messange: err.message });
  }
};
