import express from "express";
import { Request, Response, NextFunction } from "express-serve-static-core";
import cors from "cors";
import { apiRouter } from "./routes/api-router";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const app = express();

const allowedOrigins = ["http://localhost:5173", "https://exhibit-museum.netlify.app/"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", apiRouter);

interface CustomError extends Error {
  status?: number;
  code?: string;
  msg?: string;
}

app.all("*", (req: Request, res: Response) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  if (["22P02", "23502"].includes(err.code || "")) {
    res.status(400).send({ msg: "Bad Request" });
  } else next(err);
});

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  console.error("🚨 Error:", err);
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
    return;
  }
  next(err);
});

export default app;
