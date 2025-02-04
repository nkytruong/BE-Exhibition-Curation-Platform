import { NextFunction, Request, Response } from "express";
import endpoints from "../../endpoints.json"

export function getEndpoints(req: Request, res: Response, next: NextFunction){
    res.status(200).send({endpoints})
}