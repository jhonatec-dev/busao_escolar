import { Router } from "express";
import StudentController from "../controllers/student.controller";


const studentController = new StudentController();

const loginRoutes = Router();

loginRoutes.get("/", (req, res) => studentController.find(req, res));
loginRoutes.post("/", (req, res) => studentController.create(req, res));

export default loginRoutes;
