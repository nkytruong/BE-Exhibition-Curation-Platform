import express from "express"
import { usersRouter } from "./users-router"
import { authRouter } from "./auth-router"
import { userCollectionsRouter } from "./userCollections-router"
import { collectionItemsRouter } from "./collectionItems-router"

export const apiRouter = express.Router()

apiRouter.use("/auth", authRouter)
apiRouter.use("/users", usersRouter)
apiRouter.use("/userCollections", userCollectionsRouter)
apiRouter.use("/collectionItems", collectionItemsRouter)