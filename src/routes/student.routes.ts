import { Router } from "express";
import StudentController from "../controllers/student.controller";
import validateCreateStudent from "../middlewares/student.middleware";
import validateToken from "../middlewares/token.middleware";

const studentController = new StudentController();

const loginRoutes = Router();

loginRoutes.get("/", validateToken, (req, res) =>
  studentController.find(req, res)
);

loginRoutes.post("/", validateCreateStudent, (req, res) =>
  studentController.create(req, res)
);

loginRoutes.put("/", validateToken, (req, res) =>
  studentController.update(req, res)
);

loginRoutes.get("/:id", validateToken, (req, res) =>
  studentController.findById(req, res)
);

loginRoutes.delete("/:id", validateToken, (req, res) =>
  studentController.delete(req, res)
);

export default loginRoutes;
