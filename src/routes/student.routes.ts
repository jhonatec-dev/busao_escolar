import { Request, Response, Router } from "express";
import StudentController from "../controllers/student.controller";
import validateCreateStudent from "../middlewares/student.middleware";
import validateToken from "../middlewares/token.middleware";

const studentController = new StudentController();

const loginRoutes = Router();

loginRoutes.get("/", validateToken, (req: Request, res: Response) =>
  studentController.find(req, res)
);

loginRoutes.post("/", validateCreateStudent, (req: Request, res: Response) =>
  studentController.create(req, res)
);

loginRoutes.put(
  "/",
  [validateToken, validateCreateStudent],
  (req: Request, res: Response) => studentController.update(req, res)
);

loginRoutes.get("/:id", validateToken, (req: Request, res: Response) =>
  studentController.findById(req, res)
);

loginRoutes.delete("/:id", validateToken, (req: Request, res: Response) =>
  studentController.delete(req, res)
);

export default loginRoutes;
