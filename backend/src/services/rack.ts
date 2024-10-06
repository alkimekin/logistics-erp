// import { db } from "../util/db";

// export type Rack = {
//   id: number;
//   createdAt?: Date;
//   updatedAt?: Date;
// };

// export const isRackExist = async (id: number) => {
//   const rackExist = await db.rack.count({
//     where: {
//       id: id,
//     },
//   });

//   if (rackExist) return true;
//   else return false;
// };

// export const createRack = async (data: any): Promise<Rack | null> => {
//   return db.rack.create({
//     data: {
//       id: data?.id,
//     },
//     select: {
//       id: true,
//       palettes: true,
//     },
//   });
// };

// export const readRack = async (where: any): Promise<Rack | null> => {
//   return db.rack.findUnique({
//     where: {
//       id: where?.id,
//     },
//     select: {
//       id: true,
//       palettes: true,
//     },
//   });
// };

// export const readFilteredRacks = async (where: any): Promise<Rack[]> => {
//   return db.rack.findMany({
//     where: where,
//     select: {
//       id: true,
//       palettes: true,
//     },
//   });
// };

// export const readAllRacks = async (): Promise<Rack[]> => {
//   return db.rack.findMany({
//     select: {
//       id: true,
//       palettes: true,
//     },
//   });
// };

// export const updateRack = async (
//   where: any,
//   data: any
// ): Promise<Rack | null> => {
//   return db.rack.update({
//     where: {
//       id: where?.id,
//     },
//     data: {
//       id: data?.id,
//     },
//   });
// };

// export const deleteRack = async (where: any): Promise<Rack | null> => {
//   return db.rack.delete({
//     where: {
//       id: where?.id,
//     },
//   });
// };
