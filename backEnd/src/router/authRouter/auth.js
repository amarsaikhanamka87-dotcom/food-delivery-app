import { Router } from "express";
import {
  loginController,
  signUpController,
} from "../../controller/auth/auth.js";

import {
  ckeckIfUserExist,
  requiredPasswordAndEmail,
  validaidUser,
} from "../../middleware/auth-middleware.js";

export const authRouter = Router();
authRouter
  .post("/signUp", requiredPasswordAndEmail, ckeckIfUserExist, signUpController)
  .post("/login", requiredPasswordAndEmail, validaidUser, loginController);
