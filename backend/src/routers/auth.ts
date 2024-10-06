import express from "express";
import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { AuthRequiredRequest, requireAuth } from "../middlewares/requireAuth";
import { db } from "../util/db";

export const authRouter = express.Router();

// GET: Returns all users
authRouter.get(
  "/",
  requireAuth,
  async (req: AuthRequiredRequest, res: Response) => {
    try {
      const users = await db.user.findMany({
        where: {
          role: "USER",
        },
      });

      return res.status(200).json({ users, user: req.user });
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  }
);

// GET: Returns all users
authRouter.get(
  "/getAllUsers",
  requireAuth,
  async (req: AuthRequiredRequest, res: Response) => {
    try {
      const users = await db.user.findMany({
        select: {
          id: true,
          email: true,
          role: true,
          name: true,
          surname: true,
        },
      });

      return res.status(200).json(users);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  }
);

// GET: Returns all users
authRouter.get(
  "/getLiftUsers",
  requireAuth,
  async (req: AuthRequiredRequest, res: Response) => {
    try {
      const users = await db.user.findMany({
        where: {
          role: "LIFTER",
        },
        select: {
          id: true,
          email: true,
          role: true,
          name: true,
          surname: true,
        },
      });

      return res.status(200).json(users);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  }
);

// GET: Returns whether a user is authenticated or not
authRouter.get(
  "/getTokenUser",
  requireAuth,
  async (req: AuthRequiredRequest, res: Response) => {
    try {
      const user = await db.user.findUnique({
        where: {
          email: req.user,
        },
        select: {
          id: true,
          email: true,
          role: true,
        },
      });

      return res.status(200).json({ ...user });
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  }
);

// GET: Returns a users
authRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const user = await db.user.findUnique({
      where: {
        id: id,
      },
    });

    return res.status(200).json(user);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

// POST: /api/auth/register
authRouter.post(
  "/register",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userExist =
        (await db.user.count({
          where: { email: req.body.email },
        })) > 0;

      if (userExist) {
        return res
          .status(400)
          .json({ error: "User already exists with that email" });
      }

      const hashed_password = await bcrypt.hash(req.body.password, 10);

      const user = await db.user.create({
        data: {
          email: req.body.email,
          password: hashed_password,
        },
      });

      //   await AuthService.registerUser(
      //   req.body.email,
      //   hashed_password
      // );

      const token = jwt.sign(
        { iss: "logistics-erp-auth-endpoint", user: req.body.email },
        process.env.SECRET_KEY as string,
        { expiresIn: "8h" }
      );

      return res.status(201).json({ email: req.body.email, token });
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  }
);

// POST: /api/auth/login
authRouter.post(
  "/login",
  body("email").isEmail(),
  body("password").isString(),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userExist =
        (await db.user.count({
          where: { email: req.body.email },
        })) > 0;

      if (!userExist) {
        return res.status(404).json({
          error:
            "Kullanıcı bulunamadı. Lütfen giriş bilgilerinizi kontrol edin.",
        });
      }

      const user = await db.user.findUniqueOrThrow({
        where: {
          email: req.body.email,
        },
        select: {
          email: true,
          password: true,
        },
      });

      const authenticated = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!authenticated) {
        return res
          .status(401)
          .json({ error: "Geçersiz kullanıcı adı veya şifre." });
      }

      const token = jwt.sign(
        { iss: "logistics-erp-auth-endpoint", user: req.body.email },
        process.env.SECRET_KEY as string,
        { expiresIn: "8h" }
      );

      return res.status(200).json({ email: req.body.email, token: token });
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  }
);
