import express from "express";
import type { Request, Response } from "express";
import { body, query, matchedData, validationResult } from "express-validator";

import { db } from "../util/db";

export const orderRouter = express.Router();

// GET: /api/order/all
orderRouter.get("/all", async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const orders = await db.order.findMany({
      include: {
        dispatchNotes: {
          include: {
            products: true,
          },
        },
      },
    });

    return res.status(200).json(orders);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

// GET: /api/order/groupProductsWithDispatchNotes
orderRouter.post(
  "/groupProductsWithDispatchNotes",
  body("dispatchNoteIds").isArray(),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const options = matchedData(req);

      const dispatchProductsWithSum = await db.dispatchProduct.groupBy({
        by: ["baseProductId", "lotNumber"],
        where: {
          dispatchNoteId: {
            in: options?.dispatchNoteIds,
          },
        },
        _sum: {
          count: true,
        },
      });

      let newDispatchProductsWithSum = [];
      for (const dispatchProductWithSum of dispatchProductsWithSum) {
        const baseProduct = await db.baseProduct.findUnique({
          where: { id: dispatchProductWithSum.baseProductId || undefined },
        });

        newDispatchProductsWithSum.push({
          baseProduct,
          lotNumber: dispatchProductWithSum.lotNumber,
          total: dispatchProductWithSum._sum.count,
        });
      }

      return res.status(200).json(newDispatchProductsWithSum);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  }
);

// POST: /api/order/createOrderWithWorkOrders
orderRouter.post(
  "/createOrderWithWorkOrders",
  body("userId").isNumeric(),
  body("dispatchNoteIds").isArray(),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const options = matchedData(req);

      // Create an empty order.
      const order = await db.order.create({
        data: {
          dispatchNotes: {
            connect: [...options.dispatchNoteIds.map((id: number) => ({ id }))],
          },
        },
        include: {
          dispatchNotes: true,
        },
      });

      // Create an empty liftWorkOrder.
      const liftWorkOrder = await db.liftWorkOrder.create({
        data: {
          user: {
            connect: {
              id: options.userId,
            },
          },
          order: {
            connect: {
              id: order.id,
            },
          },
        },
      });

      const dispatchProductsWithSum = await db.dispatchProduct.groupBy({
        by: ["baseProductId", "lotNumber"],
        where: {
          dispatchNoteId: {
            in: options?.dispatchNoteIds,
          },
        },
        _sum: {
          count: true,
        },
      });

      console.log(dispatchProductsWithSum);

      for (let i = 0; i < dispatchProductsWithSum.length; i++) {
        let unmatchedProductCount = dispatchProductsWithSum[i]._sum.count;

        if (!unmatchedProductCount) continue;

        console.log("UNMATCHED PRODUCT COUNT");
        console.log(unmatchedProductCount);

        // Palette Work Orders
        const palettes = await db.palette.findMany({
          where: {
            baseProductId: dispatchProductsWithSum[i].baseProductId,
            lotNumber: dispatchProductsWithSum[i].lotNumber,
            restiriction: "NONE",
            parcels: {
              every: {
                restiriction: "NONE",
                products: {
                  every: {
                    restiriction: "NONE",
                  },
                },
              },
            },
          },
          select: {
            id: true,
            rackId: true,
            productNumber: true,
          },
          orderBy: {
            productNumber: "desc",
          },
        });

        if (!palettes.length) {
          console.log(
            `There is no stock with lot ${dispatchProductsWithSum[i].lotNumber}`
          );
          continue;
        }

        console.log("PALETTES");
        console.log(palettes);

        // let takenPalettes: {
        //   [key: number]: { count: number; paletteId: string };
        // } = {};

        for (let j = 0; j < palettes.length; j++) {
          if (palettes[j].productNumber <= unmatchedProductCount) {
            await db.palette.update({
              where: {
                id: palettes[j].id,
              },
              data: {
                orderId: order.id,
                restiriction: "WAITS_FORKLIFT",
              },
            });

            unmatchedProductCount -= palettes[j].productNumber;
          }
        }

        console.log("PALETTE MATCH DONE. LEFT UNMATCHED PRODUCT COUNT");
        console.log(unmatchedProductCount);

        const parcels = await db.parcel.findMany({
          where: {
            restiriction: "NONE",
            palette: {
              baseProductId: dispatchProductsWithSum[i].baseProductId,
              lotNumber: dispatchProductsWithSum[i].lotNumber,
              restiriction: "NONE",
            },
            products: {
              every: {
                restiriction: "NONE",
              },
            },
          },
          select: {
            id: true,
            products: true,
            palette: true,
          },
          orderBy: [
            {
              palette: {
                productNumber: "asc",
              },
            },
            {
              products: {
                _count: "desc",
              },
            },
          ],
        });

        for (let j = 0; j < parcels.length; j++) {
          if (parcels[j].products.length <= unmatchedProductCount) {
            await db.parcel.update({
              where: {
                id: parcels[j].id,
              },
              data: {
                orderId: order.id,
                restiriction: "WAITS_FORKLIFT",
              },
            });

            unmatchedProductCount -= parcels[j].products.length;
          }
        }

        // for (const [key, { count, paletteId }] of Object.entries(
        //   takenParcels
        // )) {
        //   await db.workOrder.create({
        //     data: {
        //       rackId: parseInt(key),
        //       containerType: "PARCEL",
        //       containerCount: count,
        //     },
        //   });

        //   await db.palette.update({
        //     where: {
        //       id: paletteId,
        //     },
        //     data: {
        //       restiriction: "WAITS_FORKLIFT",
        //     },
        //   });
        // }

        console.log("PARCEL MATCH DONE. LEFT UNMATCHED PRODUCT COUNT");
        console.log(unmatchedProductCount);

        const products = await db.product.findMany({
          where: {
            restiriction: "NONE",
            parcel: {
              restiriction: "NONE",
              palette: {
                baseProductId: dispatchProductsWithSum[i].baseProductId,
                lotNumber: dispatchProductsWithSum[i].lotNumber,
                restiriction: "NONE",
              },
            },
          },
          select: {
            serialNumber: true,
            parcel: {
              select: {
                palette: true,
              },
            },
          },
          orderBy: [
            {
              parcel: {
                palette: {
                  productNumber: "asc",
                },
              },
            },
            {
              parcel: {
                products: {
                  _count: "asc",
                },
              },
            },
          ],
        });

        if (products.length < unmatchedProductCount) {
          console.log("There is not enough product in stock to be matched");
        }

        for (let j = 0; 0 < unmatchedProductCount; j++) {
          await db.product.update({
            where: {
              serialNumber: products[j].serialNumber,
            },
            data: {
              orderId: order.id,
              restiriction: "WAITS_FORKLIFT",
            },
          });

          unmatchedProductCount--;
        }

        console.log("PARCEL MATCH DONE. LEFT UNMATCHED PRODUCT COUNT");
        console.log(unmatchedProductCount);
      }

      const updatedOrder = await db.order.findUnique({
        where: {
          id: order.id,
        },
      });

      return res.status(200).json(updatedOrder);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  }
);

// GET: /api/order/liftWorkOrdersInOperatorView
orderRouter.get(
  "/liftWorkOrdersInOperatorView",
  query("userId").optional().isString().toInt(),
  body("userId").optional().isNumeric(),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const options = matchedData(req);

      const orders = await db.order.findMany({
        where: {
          liftWorkOrder: {
            userId: options.userId,
          },
        },
        select: {
          id: true,
        },
      });

      const liftOrdersInOperatorView: any[] = [];

      for (const order of orders) {
        let liftOrderInOperatorView: {
          [rackId: number]: {
            palettes: any;
            parcels: any;
            products: any;
            openParcels: any;
          };
        } = {};

        const paletteLiftOrderInOperatorView = await db.palette.findMany({
          where: {
            orderId: order.id,
            restiriction: "WAITS_FORKLIFT",
          },
          select: {
            id: true,
            rackId: true,
          },
        });

        paletteLiftOrderInOperatorView.forEach((palette) => {
          const rackId: number = palette.rackId ? palette.rackId : -1;

          if (!liftOrderInOperatorView[rackId]) {
            liftOrderInOperatorView[rackId] = {
              palettes: [],
              parcels: [],
              products: [],
              openParcels: [],
            };
          }

          liftOrderInOperatorView[rackId].palettes = [
            ...liftOrderInOperatorView[rackId].palettes,
            palette.id,
          ];
        });

        const parcelLiftOrderInOperatorView = await db.parcel.findMany({
          where: {
            orderId: order.id,
            restiriction: "WAITS_FORKLIFT",
          },
          select: {
            id: true,
            palette: {
              select: {
                rackId: true,
                arrival: {
                  select: {
                    maxParcelSize: true,
                  },
                },
              },
            },
          },
        });

        for (const parcel of parcelLiftOrderInOperatorView) {
          const rackId: number = parcel?.palette?.rackId
            ? parcel.palette.rackId
            : -1;

          if (!liftOrderInOperatorView[rackId]) {
            liftOrderInOperatorView[rackId] = {
              palettes: [],
              parcels: [],
              products: [],
              openParcels: [],
            };
          }

          const parcelSize = await db.product.count({
            where: { parcelId: parcel.id },
          });

          if (
            parcel.palette?.arrival?.maxParcelSize &&
            parcelSize == parcel.palette?.arrival?.maxParcelSize
          ) {
            liftOrderInOperatorView[rackId].parcels = [
              ...liftOrderInOperatorView[rackId].parcels,
              parcel.id,
            ];
          } else {
            liftOrderInOperatorView[rackId].openParcels = [
              ...liftOrderInOperatorView[rackId].openParcels,
              parcel.id,
            ];
          }
        }

        const productLiftOrderInOperatorView = await db.product.findMany({
          where: {
            orderId: order.id,
            restiriction: "WAITS_FORKLIFT",
          },
          select: {
            serialNumber: true,
            parcel: {
              select: {
                palette: {
                  select: {
                    rackId: true,
                  },
                },
              },
            },
          },
        });

        productLiftOrderInOperatorView.forEach((product) => {
          const rackId: number = product?.parcel?.palette?.rackId
            ? product.parcel.palette.rackId
            : -1;

          if (!liftOrderInOperatorView[rackId]) {
            liftOrderInOperatorView[rackId] = {
              palettes: [],
              parcels: [],
              products: [],
              openParcels: [],
            };
          }

          liftOrderInOperatorView[rackId].products = [
            ...liftOrderInOperatorView[rackId].products,
            product.serialNumber,
          ];
        });

        const newLiftOrderInOperatorView: {
          rackId: number;
          hangarName: string;
          palettes: any;
          parcels: any;
          products: any;
          openParcels?: any;
        }[] = [];

        for (const [key, value] of Object.entries(liftOrderInOperatorView)) {
          const rack = await db.rack.findUnique({
            where: {
              id: parseInt(key),
            },
            select: {
              hangar: true,
            },
          });

          newLiftOrderInOperatorView.push({
            rackId: parseInt(key),
            hangarName: rack?.hangar?.name || "",
            palettes: value.palettes.length,
            parcels: value.parcels.length,
            products: value.products.length,
            openParcels: value.openParcels,
          });

          // liftOrderInOperatorView[parseInt(key)].palettes =
          //   value.palettes.length;
          // liftOrderInOperatorView[parseInt(key)].parcels = value.parcels.length;
          // liftOrderInOperatorView[parseInt(key)].products =
          //   value.products.length;
          // liftOrderInOperatorView[parseInt(key)].openParcels =
          //   value.openParcels;
        }

        liftOrdersInOperatorView.push({
          id: order.id,
          productLocations: newLiftOrderInOperatorView,
        });
      }

      return res.status(200).json(liftOrdersInOperatorView);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  }
);

// POST: /api/order/endLiftWorkOrder
orderRouter.post(
  "/endLiftWorkOrder",
  body("orderId").isNumeric(),
  body("productIds").isArray(),
  body("parcelIds").isArray(),
  body("paletteIds").isArray(),
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const options = matchedData(req);

      // Apply cross liftOrderValidation for every palette
      for (let i = 0; i < options.paletteIds.length; i++) {
        const takenPalette = await db.palette.findUnique({
          where: {
            id: options.paletteIds[i],
          },
        });

        // This case is for both products are taken or going to be taken by an operator
        if (takenPalette?.orderId) {
          if (takenPalette?.orderId != options.orderId) {
            // If this throws that means we have some serious problems.
            const otherTakenPalette = await db.palette.findFirstOrThrow({
              where: {
                orderId: options.orderId,
                restiriction: "WAITS_FORKLIFT",
              },
            });

            // Update otherTakenPalette LiftOrderId to remote LiftOrderId
            await db.palette.update({
              where: {
                id: otherTakenPalette.id,
              },
              data: {
                orderId: takenPalette.orderId,
              },
            });

            // Update takenPalette LiftOrderId to local LiftOrderId
            await db.palette.update({
              where: {
                id: takenPalette.id,
              },
              data: {
                orderId: options.orderId,
                status: "ON_FLOOR",
                restiriction: "WAITS_PREPARATION",
              },
            });
          } else {
            // Update takenPalette
            await db.palette.update({
              where: {
                id: takenPalette.id,
              },
              data: {
                status: "ON_FLOOR",
                restiriction: "WAITS_PREPARATION",
              },
            });
          }
        }
      }

      // After cross validation apply one sided liftOrderValidation for every palette
      for (let i = 0; i < options.paletteIds.length; i++) {
        const takenPalette = await db.palette.findUnique({
          where: {
            id: options.paletteIds[i],
          },
        });

        if (!takenPalette?.orderId) {
          const untakenPalette = await db.palette.findFirstOrThrow({
            where: {
              orderId: options.orderId,
              restiriction: "WAITS_FORKLIFT",
            },
          });

          // Here we are disconnecting untakenPalette from LiftOrder.
          await db.palette.update({
            where: {
              id: untakenPalette.id,
            },
            data: {
              order: {
                disconnect: true,
              },
              restiriction: "NONE",
            },
          });

          // Here we are connecting takenPalette with LiftOrder
          await db.palette.update({
            where: {
              id: takenPalette?.id,
            },
            data: {
              orderId: options.orderId,
              status: "ON_FLOOR",
              restiriction: "WAITS_PREPARATION",
            },
          });
        }
      }

      // Apply cross liftOrderValidation for every parcel
      for (let i = 0; i < options.parcelIds.length; i++) {
        const takenParcel = await db.parcel.findUnique({
          where: {
            id: options.parcelIds[i],
          },
        });

        // This case is for both products are taken or going to be taken by an operator
        if (takenParcel?.orderId) {
          if (takenParcel?.orderId != options.orderId) {
            // If this throws that means we have some serious problems.
            const otherTakenParcel = await db.parcel.findFirstOrThrow({
              where: {
                orderId: options.orderId,
                restiriction: "WAITS_FORKLIFT",
              },
            });

            // Update otherTakenParcel LiftOrderId to remote LiftOrderId
            await db.parcel.update({
              where: {
                id: otherTakenParcel.id,
              },
              data: {
                orderId: takenParcel.orderId,
              },
            });

            // Update takenParcel LiftOrderId to local LiftOrderId
            await db.parcel.update({
              where: {
                id: takenParcel.id,
              },
              data: {
                orderId: options.orderId,
                status: "ON_FLOOR",
                restiriction: "WAITS_PREPARATION",
              },
            });
          } else {
            // Update takenParcel
            await db.parcel.update({
              where: {
                id: takenParcel.id,
              },
              data: {
                status: "ON_FLOOR",
                restiriction: "WAITS_PREPARATION",
              },
            });
          }
        }
      }

      // After cross validation apply one sided liftOrderValidation for every parcel
      for (let i = 0; i < options.parcelIds.length; i++) {
        const takenParcel = await db.parcel.findUnique({
          where: {
            id: options.parcelIds[i],
          },
        });

        if (!takenParcel?.orderId) {
          const untakenParcel = await db.parcel.findFirstOrThrow({
            where: {
              orderId: options.orderId,
              restiriction: "WAITS_FORKLIFT",
            },
          });

          // Here we are disconnecting untakenParcel from LiftOrder.
          await db.parcel.update({
            where: {
              id: untakenParcel.id,
            },
            data: {
              order: {
                disconnect: true,
              },
              restiriction: "NONE",
            },
          });

          // Here we are connecting takenParcel with LiftOrder
          await db.parcel.update({
            where: {
              id: takenParcel?.id,
            },
            data: {
              orderId: options.orderId,
              status: "ON_FLOOR",
              restiriction: "WAITS_PREPARATION",
            },
          });
        }
      }

      // Apply cross liftOrderValidation for every product
      for (let i = 0; i < options.productIds.length; i++) {
        const takenProduct = await db.product.findUnique({
          where: {
            serialNumber: options.productIds[i],
          },
        });

        // This case is for both products are taken or going to be taken by an operator
        if (takenProduct?.orderId) {
          if (takenProduct?.orderId != options.orderId) {
            // If this throws that means we have some serious problems.
            const otherTakenProduct = await db.product.findFirstOrThrow({
              where: {
                orderId: options.orderId,
                restiriction: "WAITS_FORKLIFT",
              },
            });

            // Update otherTakenProduct LiftOrderId to remote LiftOrderId
            await db.product.update({
              where: {
                serialNumber: otherTakenProduct.serialNumber,
              },
              data: {
                orderId: takenProduct.orderId,
              },
            });

            // Update takenProduct LiftOrderId to local LiftOrderId
            await db.product.update({
              where: {
                serialNumber: takenProduct.serialNumber,
              },
              data: {
                orderId: options.orderId,
                status: "ON_FLOOR",
                restiriction: "WAITS_PREPARATION",
              },
            });
          } else {
            // Update takenProduct
            await db.product.update({
              where: {
                serialNumber: takenProduct.serialNumber,
              },
              data: {
                restiriction: "WAITS_PREPARATION",
              },
            });
          }
        }
      }

      // After cross validation apply one sided liftOrderValidation for every product
      for (let i = 0; i < options.productIds.length; i++) {
        const takenProduct = await db.product.findUnique({
          where: {
            serialNumber: options.productIds[i],
          },
        });

        if (!takenProduct?.orderId) {
          const untakenProduct = await db.product.findFirstOrThrow({
            where: {
              orderId: options.orderId,
              restiriction: "WAITS_FORKLIFT",
            },
          });

          // Here we are disconnecting untakenProduct from LiftOrder.
          await db.product.update({
            where: {
              serialNumber: untakenProduct.serialNumber,
            },
            data: {
              order: {
                disconnect: true,
              },
              restiriction: "NONE",
            },
          });

          // Here we are connecting takenProduct with LiftOrder
          await db.product.update({
            where: {
              serialNumber: takenProduct?.serialNumber,
            },
            data: {
              orderId: options.orderId,
              status: "ON_FLOOR",
              restiriction: "WAITS_PREPARATION",
            },
          });
        }
      }

      return res.status(200).json("Success");
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  }
);
