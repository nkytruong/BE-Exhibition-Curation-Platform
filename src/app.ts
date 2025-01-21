import express from 'express';
import { Request, Response, NextFunction } from "express-serve-static-core";
// import authRouter from "./routes/authRouter"
import cors from "cors"

const app = express()

app.use(cors())

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Listening on port 9090!');
  });

// app.use(authRouter)

export default app