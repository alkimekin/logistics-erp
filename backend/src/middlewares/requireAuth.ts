import type { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";

export interface AuthRequiredRequest extends Request {
  user?: any;
  rawBody?: any;
}

export const requireAuth = (
  req: AuthRequiredRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"] as string;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(
      token,
      process.env.SECRET_KEY as string,
      (err: any, payload: any) => {
        if (err) {
          return res.sendStatus(403);
        }

        req.user = payload.user;

        next();
      }
    );
  } else {
    return res.sendStatus(401);
  }
};
