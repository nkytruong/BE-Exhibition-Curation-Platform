import express from "express"
import { usersRouter } from "./users-router"
import { authRouter } from "./auth-router"

export const apiRouter = express.Router()

apiRouter.use("/auth", authRouter)
apiRouter.use("/users", usersRouter)