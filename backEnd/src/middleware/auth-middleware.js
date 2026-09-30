import { User } from "../model/userShema.js";

export const requiredPasswordAndEmail = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ messenge: "need password and email" });
  } else {
    next();
  }
};

export const validaidUser = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404).json({ messenge: "user is not found" });
  } else {
    req.user = user;
    next();
  }
};

export const ckeckIfUserExist = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    res.status(400).json({ messenge: "user already exist" });
  } else {
    next();
  }
};
