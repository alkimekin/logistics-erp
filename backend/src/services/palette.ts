// import { db } from "../util/db";

// export type Palette = {
//   id: string;
//   rackId: number | null;
//   createdAt?: Date;
//   updatedAt?: Date;
// };

// export const isPaletteExist = async (id: string) => {
//   const paletteExist = await db.palette.count({
//     where: {
//       id: id,
//     },
//   });

//   if (paletteExist) return true;
//   else return false;
// };

// export const createPalette = async (data: any): Promise<Palette | null> => {
//   return db.palette.create({
//     data: {
//       id: data?.id,
//     },
//     select: {
//       id: true,
//       rackId: true,
//     },
//   });
// };

// export const createPaletteWithRack = async (
//   data: any
// ): Promise<Palette | null> => {
//   return db.palette.create({
//     data: {
//       rack: {
//         connect: {
//           id: data?.rackId,
//         },
//       },
//       id: data?.id,
//     },
//     select: {
//       id: true,
//       rackId: true,
//     },
//   });
// };

// export const createPaletteWithRackAndArrival = async (
//   data: any,
//   arrivalId: number
// ): Promise<Palette | null> => {
//   return db.palette.create({
//     data: {
//       rack: {
//         connect: {
//           id: data?.rackId,
//         },
//       },
//       arrival: {
//         connect: {
//           id: arrivalId,
//         },
//       },
//       id: data?.id,
//     },
//     select: {
//       id: true,
//       rackId: true,
//     },
//   });
// };

// export const readPalette = async (id: string): Promise<Palette | null> => {
//   return db.palette.findUnique({
//     where: {
//       id: id,
//     },
//     select: {
//       id: true,
//       rackId: true,
//     },
//   });
// };

// export const readFilteredPalettes = async (where: any): Promise<Palette[]> => {
//   return db.palette.findMany({
//     where: where,
//     select: {
//       id: true,
//       rackId: true,
//     },
//   });
// };

// export const readAllPalettes = async (): Promise<Palette[]> => {
//   return db.palette.findMany({
//     select: {
//       id: true,
//       rackId: true,
//     },
//   });
// };

// export const updatePalette = async (
//   where: any,
//   data: any
// ): Promise<Palette | null> => {
//   return db.palette.update({
//     where: {
//       id: where?.id,
//     },
//     data: {
//       rack: {
//         connect: {
//           id: data?.rackId,
//         },
//       },
//       id: data?.id,
//     },
//   });
// };

// export const deletePalette = async (where: any): Promise<Palette | null> => {
//   return db.palette.delete({
//     where: {
//       id: where?.id,
//     },
//   });
// };
