import { NextFunction, Request, Response } from "express";
import { fetchUser } from "../models/users-model";
import { User } from "../types/types";

export function getUser(req: Request, res: Response, next: NextFunction){
  const user_id = Number(req.params.user_id)

  if (isNaN(user_id)) {
    res.status(400).send(({msg: "Invalid User ID"}))
    return;
  }

  fetchUser(user_id)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
