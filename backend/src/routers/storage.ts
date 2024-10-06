import express from "express";
import type { Request, Response } from "express";
import { body, query, matchedData, validationResult } from "express-validator";

import { Hangar } from "@prisma/client";
import { db } from "../util/db";

export const storageRouter = express.Router();

//GET: /api/storage/parcel/all
storageRouter.get("/parcel/all", async (req: Request, res: Response) => {
  try {
    const parcels = await db.parcel.findMany();
    return res.status(200).json(parcels);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

//GET: /api/storage/palette/all
storageRouter.get("/palette/all", async (req: Request, res: Response) => {
  try {
    const products = await db.palette.findMany();
    return res.status(200).json(products);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

storageRouter.get(
  "/palette/unique",
  body("paletteId").optional().isString(),
  query("paletteId").optional().isString(),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const options = matchedData(req);

      const palette = await db.palette.findUnique({
        where: {
          id: options?.paletteId,
        },
        select: {
          id: true,
          hangar: {
            select: {
              id: true,
              name: true,
              racks: {
                select: {
                  id: true,
                  palette: {
                    select: {
                      id: true,
                      baseProduct: true,
                      arrival: true,
                      expirationDate: true,
                    },
                  },
                },
              },
            },
          },
          hangarId: true,
          rack: true,
        },
      });
      return res.status(200).json(palette);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  }
);

storageRouter.post(
  "/palette/update",
  body("paletteId").optional().isString(),
  query("paletteId").optional().isString(),
  body("hangarId").optional().isNumeric(),
  query("hangarId").optional().isString().toInt(),
  body("rackId").optional().isNumeric(),
  query("rackId").optional().isString().toInt(),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const options = matchedData(req);

      await db.rack.update({
        where: {
          id: options.rackId,
        },
        data: {
          hangar: {
            connect: {
              id: options.hangarId,
            },
          },
        },
      });

      const palette = await db.palette.update({
        where: {
          id: options.paletteId,
        },
        data: {
          hangar: {
            connect: {
              id: options.hangarId,
            },
          },
          rack: {
            connect: {
              id: options.rackId,
            },
          },
        },
        select: {
          id: true,
          hangar: {
            select: {
              id: true,
              name: true,
              racks: {
                select: {
                  id: true,
                  palette: {
                    select: {
                      id: true,
                      baseProduct: true,
                      arrival: true,
                      expirationDate: true,
                    },
                  },
                },
              },
            },
          },
          hangarId: true,
          rack: true,
        },
      });
      return res.status(200).json(palette);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  }
);

storageRouter.get("/hangar/names", async (req: Request, res: Response) => {
  try {
    const hangars = await db.hangar.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return res.status(200).json(hangars);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

storageRouter.get("/hangar/all", async (req: Request, res: Response) => {
  try {
    const hangars = await db.hangar.findMany({
      select: {
        id: true,
        name: true,
        racks: {
          select: {
            id: true,
            palette: {
              select: {
                id: true,
                baseProduct: true,
                arrival: true,
                expirationDate: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json(hangars);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

storageRouter.get("/rack/ids", async (req: Request, res: Response) => {
  try {
    const racks = await db.rack.findMany({
      select: {
        id: true,
      },
    });

    return res.status(200).json(racks);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

storageRouter.get("/rack/all", async (req: Request, res: Response) => {
  try {
    const racks = await db.rack.findMany({
      select: {
        id: true,
        palette: true,
      },
    });

    return res.status(200).json(racks);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

storageRouter.get(
  "/emptyRacks",
  body("hangarId").optional().isNumeric(),
  body("hangarName").optional().isString(),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const options = matchedData(req);

      const hangars = await db.hangar.findMany({
        where: {
          id: options?.hangarId,
          name: options?.hangarName,
          // racks: {
          //   some: {
          //     palette: null,
          //   },
          // },
        },
        select: {
          id: true,
          name: true,
          racks: {
            where: {
              palette: null,
            },
            select: {
              id: true,
            },
          },
        },
      });

      var result = {};
      hangars.forEach((hangar) => {
        result = {
          ...result,
          [hangar.id]: {
            id: hangar.id,
            name: hangar.name,
            emptyRacks: hangar.racks,
          },
        };
      });

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  }
);
