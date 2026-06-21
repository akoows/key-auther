import { Router } from "express";
import { userCreateController } from "../controllers/userController.js";

const userRouter = Router();

userRouter.post("/users", userCreateController);

export default userRouter;