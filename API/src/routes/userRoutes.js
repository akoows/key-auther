import { Router } from "express";
import { userCreateController } from "../controllers/userController.js";

const userRouter = Router();

userRouter.post("/", userCreateController);

export default userRouter;