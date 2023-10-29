import { Request, Response, Router } from "express";
import { LoginController } from "../controllers/login.controller";
import validateLogin from "../middlewares/login.middleware";

const loginRoutes = Router();

const loginController = new LoginController();

loginRoutes.post("/", [validateLogin], (req: Request, res: Response) =>
  loginController.login(req, res)
);

export default loginRoutes;
