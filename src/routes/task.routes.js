import { Router } from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/task.controllers.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/")
  .post(createTask)
  .get(getTasks);

router.route("/:id")
  .put(updateTask)
  .delete(deleteTask);

export default router;