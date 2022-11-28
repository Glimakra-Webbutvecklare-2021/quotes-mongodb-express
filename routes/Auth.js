import { Router } from "express";
import AuthController from "../controllers/Auth.js";
import {ensureNotAuth, ensureAuth} from "../middleware/Auth.js";

const AuthRouter = Router();

AuthRouter.get("/", AuthController.getHome);

AuthRouter.get("/login", ensureNotAuth, AuthController.getLogin);
AuthRouter.post("/login", ensureNotAuth, AuthController.login);

AuthRouter.get("/register", ensureNotAuth, AuthController.getRegister);
AuthRouter.post("/register", ensureNotAuth, AuthController.register);

AuthRouter.get("/logout", ensureAuth, AuthController.logout)


export default AuthRouter;