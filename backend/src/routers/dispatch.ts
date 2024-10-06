import express from "express";
import type { Request, Response } from "express";
import { body, query, matchedData, validationResult } from "express-validator";

import { db } from "../util/db";

export const dispatchRouter = express.Router();

// GET: /api/dispatch/all
dispatchRouter.get("/all", async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const dispatchNotes = await db.dispatchNote.findMany({
      include: {
        products: true,
      },
    });

    return res.status(200).json(dispatchNotes);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

// GET: /api/dispatch/allWithNoOrder
dispatchRouter.get("/allWithNoOrder", async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const dispatchNotes = await db.dispatchNote.findMany({
      where: {
        orderId: null,
      },
      include: {
        products: true,
      },
    });

    return res.status(200).json(dispatchNotes);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

// POST: /api/dispatch/new
dispatchRouter.post(
  "/new",
  body("companyName").isString(),
  body("invoiceNumber").isString(),
  body("ettnCode").isString(),
  body("dispatchProducts").isArray(),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const options = matchedData(req);

      const dispatchNote = await db.dispatchNote.create({
        data: {
          companyName: options.companyName,
          invoiceNumber: options?.invoiceNumber,
          ettnCode: options?.ettnCode,
          products: {
            createMany: {
              data: options?.dispatchProducts,
            },
          },
        },
      });

      return res.status(200).json(dispatchNote);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  }
);
