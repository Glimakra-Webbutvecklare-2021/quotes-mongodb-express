import { Router } from "express";
import AuthController from "../controllers/Auth.js";

const AuthRouter = Router();

AuthRouter.get("/login", AuthController.getLogin);
AuthRouter.post("/login", AuthController.login)

export default AuthRouter;