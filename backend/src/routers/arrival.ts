import express from "express";
import type { Request, Response } from "express";
import { body, query, matchedData, validationResult } from "express-validator";

import { db } from "../util/db";

const mode = (array: number[]) => {
  if (array.length == 0) return null;

  var modeMap: { [key: number]: number } = {};

  var maxEl = array[0];
  var maxCount = 1;

  for (var i = 0; i < array.length; i++) {
    var el = array[i];

    if (modeMap[el] == null) modeMap[el] = 1;
    else modeMap[el]++;

    if (modeMap[el] > maxCount) {
      maxEl = el;
      maxCount = modeMap[el];
    }
  }

  return maxEl;
};

export const arrivalRouter = express.Router();

// POST: /api/arrival/new
arrivalRouter.post(
  "/new",
  body("companyName").isString(),
  body("invoiceNumber").isString(),
  body("palettes").isArray(),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const options = matchedData(req);

      const arrival = await db.arrival.create({
        data: {
          companyName: options.companyName,
          invoiceNumber: options?.invoiceNumber,
          status: "ENTERED_HANGAR",
          restiriction: "WAITS_WATCHFILE",
        },
        select: {
          id: true,
          companyName: true,
          invoiceNumber: true,
          status: true,
        },
      });

      for (let i = 0; i < options.palettes.length; i++) {
        await db.palette.create({
          data: {
            id: options.palettes[i].paletteId,
            hangar: {
              connect: {
                id: parseInt(options.palettes[i].hangarId),
              },
            },
            rack: {
              connect: {
                id: parseInt(options.palettes[i].rackId),
              },
            },
            baseProduct: {
              connect: {
                id: parseInt(options.palettes[i].baseProductId),
              },
            },
            productCode: options.palettes[i]?.productCode,
            lotNumber: options.palettes[i]?.lotNumber,
            expirationDate: options.palettes[i]?.expirationDate,
            productNumber: parseInt(options.palettes[i]?.productNumber),
            arrival: {
              connect: {
                id: arrival.id,
              },
            },
            status: "ON_RACK",
            restiriction: "WAITS_WATCHFILE",
          },
        });

        await db.rack.update({
          where: {
            id: parseInt(options.palettes[i].rackId),
          },
          data: {
            hangar: {
              connect: {
                id: parseInt(options.palettes[i].hangarId),
              },
            },
          },
        });
      }

      return res.status(200).json(arrival);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  }
);

// GET: /api/arrival/all
arrivalRouter.get("/all", async (req: Request, res: Response) => {
  try {
    const arrivals = await db.arrival.findMany({
      select: {
        id: true,
        status: true,
        companyName: true,
        invoiceNumber: true,
        watchfileLoaded: true,
        palettes: {
          select: {
            id: true,
            hangar: {
              select: {
                id: true,
                name: true,
                racks: {
                  select: {
                    id: true,
                    palette: true,
                  },
                },
              },
            },
            hangarId: true,
            rack: {
              select: {
                id: true,
              },
            },
          },
        },
        watchfileErrors: true,
      },
    });

    return res.status(200).json(arrivals);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

// GET: /api/arrival/inHangar
arrivalRouter.get("/inHangar", async (req: Request, res: Response) => {
  try {
    const arrivals = await db.arrival.findMany({
      where: {
        status: "ENTERED_HANGAR",
      },
      select: {
        id: true,
        status: true,
        companyName: true,
        invoiceNumber: true,
        watchfileLoaded: true,
        palettes: {
          select: {
            id: true,
            hangar: {
              select: {
                id: true,
                name: true,
                racks: {
                  select: {
                    id: true,
                    palette: true,
                  },
                },
              },
            },
            hangarId: true,
            rack: {
              select: {
                id: true,
              },
            },
          },
        },
        watchfileErrors: true,
      },
    });

    return res.status(200).json(arrivals);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

// GET: /api/arrival/watchfile
arrivalRouter.get("/watchfile", async (req: Request, res: Response) => {
  try {
    const arrivals = await db.arrival.findMany({
      where: {
        OR: [
          {
            status: "ENTERED_HANGAR",
          },
          {
            status: "WATCHFILE_IMPORTED",
          },
        ],
      },
      select: {
        id: true,
        status: true,
        companyName: true,
        invoiceNumber: true,
        watchfileLoading: true,
        watchfileLoaded: true,
        palettes: {
          select: {
            id: true,
            hangar: {
              select: {
                id: true,
                name: true,
                racks: {
                  select: {
                    id: true,
                    palette: true,
                  },
                },
              },
            },
            hangarId: true,
            rack: {
              select: {
                id: true,
              },
            },
          },
        },
        watchfileErrors: true,
      },
    });

    return res.status(200).json(arrivals);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

// GET: /api/arrival/confirmed
arrivalRouter.get("/confirmed", async (req: Request, res: Response) => {
  try {
    const arrivals = await db.arrival.findMany({
      where: {
        OR: [{ status: "WATCHFILE_IMPORTED" }, { status: "CONFIRMED" }],
      },
      select: {
        id: true,
        status: true,
        companyName: true,
        invoiceNumber: true,
        watchfileLoaded: true,
        palettes: {
          select: {
            id: true,
            hangar: {
              select: {
                id: true,
                name: true,
                racks: {
                  select: {
                    id: true,
                    palette: true,
                  },
                },
              },
            },
            hangarId: true,
            rack: {
              select: {
                id: true,
              },
            },
          },
        },
        watchfileErrors: true,
      },
    });

    return res.status(200).json(arrivals);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

//POST: /api/arrival/import_xml
arrivalRouter.post(
  "/import_xml",
  query("arrivalId").isString().toInt(),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const options = matchedData(req);

      await db.arrival.update({
        where: {
          id: options?.arrivalId,
        },
        data: {
          watchfileLoading: true,
          watchfileLoaded: false,
        },
      });

      await db.palette.updateMany({
        where: {
          arrivalId: options?.arrivalId,
        },
        data: {
          isWatchfileImported: false,
        },
      });

      // Delete all previous watchfile errors first
      await db.watchfileError.deleteMany({
        where: {
          arrivalId: options?.arrivalId,
        },
      });

      // Delete all previous products
      await db.product.deleteMany({
        where: {
          parcel: {
            palette: {
              arrivalId: options?.arrivalId,
            },
          },
        },
      });

      // Delete all previous parcels
      await db.parcel.deleteMany({
        where: {
          palette: {
            arrivalId: options?.arrivalId,
          },
        },
      });

      let maxPaletteSize = 0;
      let maxParcelSize = 0;

      // For every palette
      for (let i = 0; i < req.body["transfer"]["carrier"].length; i++) {
        const paletteLabel =
          req.body["transfer"]["carrier"][i]["$"]["carrierLabel"];

        const isPaletteExist =
          (await db.palette.count({
            where: {
              id: paletteLabel,
              arrivalId: options?.arrivalId,
            },
          })) > 0;

        if (!isPaletteExist) {
          await db.watchfileError.create({
            data: {
              arrival: {
                connect: {
                  id: options?.arrivalId,
                },
              },
              type: "PaletteNotExistInArrival",
              text: `${paletteLabel} numarali palet bulunamadi`,
            },
          });
          continue;
        } else {
          await db.palette.update({
            where: {
              id: paletteLabel,
            },
            data: {
              isWatchfileImported: true,
              restiriction: "NONE",
            },
          });
        }

        const dbPalette = await db.palette.findUnique({
          where: {
            id: paletteLabel,
          },
        });

        // For every parcel
        for (
          let j = 0;
          j < req.body["transfer"]["carrier"][i]["carrier"].length;
          j++
        ) {
          const parcelLabel =
            req.body["transfer"]["carrier"][i]["carrier"][j]["$"][
              "carrierLabel"
            ];

          const isParcelExist =
            (await db.parcel.count({
              where: {
                id: parcelLabel,
              },
            })) > 0;

          if (!isParcelExist) {
            await db.parcel.create({
              data: {
                id: parcelLabel,
                palette: {
                  connect: {
                    id: paletteLabel,
                  },
                },
                status: dbPalette?.status || "ON_RACK",
              },
              select: {
                id: true,
                paletteId: true,
              },
            });
          }

          const gtinNumber =
            req.body["transfer"]["carrier"][i]["carrier"][j]["productlist"][0][
              "$"
            ]["GTIN"];
          const lotNumber = parseInt(
            req.body["transfer"]["carrier"][i]["carrier"][j]["productlist"][0][
              "$"
            ]["lotNumber"]
          );
          const productionDate =
            req.body["transfer"]["carrier"][i]["carrier"][j]["productlist"][0][
              "$"
            ]["productionDate"];
          const expirationDate =
            req.body["transfer"]["carrier"][i]["carrier"][j]["productlist"][0][
              "$"
            ]["expirationDate"];

          const parcelSize =
            req.body["transfer"]["carrier"][i]["carrier"][j]["productlist"][0][
              "serialnumber"
            ].length;

          if (parcelSize > maxParcelSize) {
            maxParcelSize = parcelSize;
          }

          // For every product
          for (let k = 0; k < parcelSize; k++) {
            const serialNumber =
              req.body["transfer"]["carrier"][i]["carrier"][j][
                "productlist"
              ][0]["serialnumber"][k];

            const isProductExist =
              (await db.product.count({
                where: {
                  serialNumber,
                },
              })) > 0;
            // console.log(serialNumber);
            // console.log("i:" + i + " ,j: " + j + " ,k: " + k);

            if (!isProductExist) {
              await db.product.create({
                data: {
                  serialNumber,
                  gtinNumber,
                  lotNumber,
                  productionDate,
                  expirationDate,
                  baseProduct: {
                    connect: {
                      id: dbPalette?.baseProductId || -1,
                    },
                  },
                  parcel: {
                    connect: {
                      id: parcelLabel,
                    },
                  },
                  status: dbPalette?.status || "ON_RACK",
                  restiriction: "NONE",
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
            } else {
              await db.product.update({
                where: {
                  serialNumber,
                },
                data: {
                  gtinNumber: gtinNumber,
                  lotNumber: lotNumber,
                  productionDate: productionDate,
                  expirationDate: expirationDate,
                  parcelId: parcelLabel,
                },
              });
            }
          }
          // End every product
        }
        // End every parcel

        const productCount = await db.product.count({
          where: {
            parcel: {
              palette: {
                id: paletteLabel,
              },
            },
          },
        });

        if (productCount > maxPaletteSize) {
          maxPaletteSize = productCount;
        }

        const palette = await db.palette.findUnique({
          where: {
            id: paletteLabel,
          },
        });

        if (palette?.productNumber != productCount) {
          await db.watchfileError.create({
            data: {
              arrival: {
                connect: {
                  id: options?.arrivalId,
                },
              },
              type: "ProductNumberNotEqual",
              text: `${paletteLabel} numarali paletteki urun sayisi(${palette?.productNumber}) xml dosyasinaki urun sayisina (${productCount}) esit degil`,
            },
          });
        }
      }
      // End every palette

      const notWatchfileImportedPalettes = await db.palette.findMany({
        where: {
          isWatchfileImported: false,
        },
      });

      for (let a = 0; a < notWatchfileImportedPalettes.length; a++) {
        await db.watchfileError.create({
          data: {
            arrival: {
              connect: {
                id: options?.arrivalId,
              },
            },
            type: "PaletteNotExistInXml",
            text: `Kabulde girisi yapilmis olan ${notWatchfileImportedPalettes[a].id} numarali palet xml dosyasinda bulunmamaktadir`,
          },
        });
      }

      const updatedArrival = await db.arrival.update({
        where: {
          id: options?.arrivalId,
        },
        data: {
          maxParcelSize: maxParcelSize,
          maxPaletteSize: maxPaletteSize,
          watchfileLoading: false,
          watchfileLoaded: true,
          status: "WATCHFILE_IMPORTED",
          restiriction: "NONE",
        },
        include: {
          watchfileErrors: true,
        },
      });

      return res.status(200).json(updatedArrival);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  }
);

// POST: /api/arrival/unblock
arrivalRouter.post(
  "/unblock",
  body("arrivalId").isNumeric(),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const options = matchedData(req);

      //TODO: Check previous status equals to "WATCHFILE_SUCCESS"

      const arrival = await db.arrival.update({
        where: {
          id: options?.arrivalId,
        },
        data: {
          status: "CONFIRMED",
        },
      });

      return res.status(200).json(arrival);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  }
);

// POST: /api/arrival/block
arrivalRouter.post(
  "/block",
  body("arrivalId").isNumeric(),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const options = matchedData(req);

      //TODO: Check previous status equals to "CONFIRMED"

      const arrival = await db.arrival.update({
        where: {
          id: options?.arrivalId,
        },
        data: {
          status: "WATCHFILE_IMPORTED",
        },
      });

      return res.status(200).json(arrival);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  }
);
