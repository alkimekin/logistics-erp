// import { db } from "../util/db";

// export type Hangar = {
//   id: string;
//   createdAt?: Date;
//   updatedAt?: Date;
// };

// export const isHangarExist = async (id: string) => {
//   const hangarExist = await db.hangar.count({
//     where: {
//       id: id,
//     },
//   });

//   if (hangarExist) return true;
//   else return false;
// };

// export const createRack = async (data: any): Promise<Hangar | null> => {
//   return db.hangar.create({
//     data: {
//       id: data?.id,
//     },
//     select: {
//       id: true,
//       racks: true,
//       palettes: true,
//     },
//   });
// };

// export const readHangar = async (where: any): Promise<Hangar | null> => {
//   return db.hangar.findUnique({
//     where: {
//       id: where?.id,
//     },
//     select: {
//       id: true,
//       racks: {
//         include: {
//           palettes: true,
//         },
//       },
//     },
//   });
// };

// export const readFilteredHangars = async (where: any): Promise<Hangar[]> => {
//   return db.hangar.findMany({
//     where: where,
//     select: {
//       id: true,
//       racks: {
//         include: {
//           palettes: true,
//         },
//       },
//     },
//   });
// };

// export const readAllHangars = async (): Promise<Hangar[]> => {
//   return db.hangar.findMany({
//     select: {
//       id: true,
//       racks: {
//         include: {
//           palettes: true,
//         },
//       },
//     },
//   });
// };

// export const updateHangar = async (
//   where: any,
//   data: any
// ): Promise<Hangar | null> => {
//   return db.hangar.update({
//     where: {
//       id: where?.id,
//     },
//     data: {
//       id: data?.id,
//     },
//   });
// };

// export const deleteHangar = async (where: any): Promise<Hangar | null> => {
//   return db.hangar.delete({
//     where: {
//       id: where?.id,
//     },
//   });
// };
