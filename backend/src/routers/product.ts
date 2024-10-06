import express from "express";
import type { Request, Response } from "express";
import { body, query, matchedData, validationResult } from "express-validator";

import * as BaseProductService from "../services/baseProduct";
import { db } from "../util/db";

export const productRouter = express.Router();

//GET: /api/product/all
productRouter.get("/all", async (req: Request, res: Response) => {
  try {
    const products = await db.product.findMany();
    return res.status(200).json(products);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

// GET: /api/product/base
productRouter.get("/base", async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const baseProducts = await BaseProductService.readAllBaseProducts();

    return res.status(200).json(baseProducts);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

// GET: /api/product/
productRouter.get(
  "/",
  body("serialNumber").optional().isString(),
  query("serialNumber").optional().isString(),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const options = matchedData(req);

      if (!options.id && !options.serialNumber) {
        return res.status(400).json({
          error:
            "At least one param between 'id' and 'serialNumber' should be provided",
          code: 400,
        });
      }

      const product = await db.product.findUnique({
        where: {
          serialNumber: options?.serialNumber,
        },
        select: {
          baseProduct: true,
          serialNumber: true,
          barcodeNumber: true,
          gtinNumber: true,
          lotNumber: true,
          productionDate: true,
          expirationDate: true,
          parcelId: true,
        },
      });

      if (!product) {
        return res
          .status(404)
          .json({ error: "Requested product was not found", code: 404 });
      }

      return res.status(200).json(product);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  }
);

// GET: /api/arrival/products
productRouter.get(
  "/all",
  body("baseProductId").optional().isNumeric(),
  query("baseProductId").optional().isString().toInt(),
  body("serialNumber").optional().isString(),
  query("serialNumber").optional().isString(),
  body("barcodeNumber").optional().isString(),
  query("barcodeNumber").optional().isString(),
  body("gtinNumber").optional().isString(),
  query("gtinNumber").optional().isString(),
  body("lotNumber").optional().isNumeric(),
  query("lotNumber").optional().isString().toInt(),
  body("productionDate").optional().isDate(),
  query("productionDate").optional().isDate(),
  body("expirationDate").optional().isDate(),
  query("expirationDate").optional().isDate(),
  body("parcelId").optional().isNumeric(),
  query("parcelid").optional().isString().toInt(),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const options = matchedData(req);

      const product = await db.product.findMany({
        where: options,
        select: {
          baseProduct: true,
          serialNumber: true,
          barcodeNumber: true,
          gtinNumber: true,
          lotNumber: true,
          productionDate: true,
          expirationDate: true,
          parcelId: true,
        },
      });

      if (!product) {
        return res
          .status(404)
          .json({ error: "Requested product was not found", code: 404 });
      }

      return res.status(200).json(product);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  }
);

productRouter.delete("/all", async (req: Request, res: Response) => {
  try {
    await db.product.deleteMany();
    return res.status(200).json("Success");
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});
