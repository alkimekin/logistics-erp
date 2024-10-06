// import { db } from "../util/db";

// export type Parcel = {
//   id: string;
//   paletteId: string | null;
//   createdAt?: Date;
//   updatedAt?: Date;
// };

// export const isParcelExist = async (id: string) => {
//   const parcelExist = await db.parcel.count({
//     where: {
//       id: id,
//     },
//   });

//   if (parcelExist) return true;
//   else return false;
// };

// export const createParcel = async (data: any): Promise<Parcel | null> => {
//   return db.parcel.create({
//     data: {
//       palette: {
//         connect: {
//           id: data?.paletteId,
//         },
//       },
//       id: data?.id,
//     },
//     select: {
//       id: true,
//       paletteId: true,
//     },
//   });
// };

// export const readParcel = async (where: any): Promise<Parcel | null> => {
//   return db.parcel.findUnique({
//     where: {
//       id: where?.id,
//     },
//     select: {
//       id: true,
//       paletteId: true,
//     },
//   });
// };

// export const readFilteredParcels = async (where: any): Promise<Parcel[]> => {
//   return db.parcel.findMany({
//     where: where,
//     select: {
//       id: true,
//       paletteId: true,
//     },
//   });
// };

// export const readAllParcels = async (): Promise<Parcel[]> => {
//   return db.parcel.findMany({
//     select: {
//       id: true,
//       paletteId: true,
//     },
//   });
// };

// export const updateParcel = async (
//   where: any,
//   data: any
// ): Promise<Parcel | null> => {
//   return db.parcel.update({
//     where: {
//       id: where?.id,
//     },
//     data: {
//       palette: {
//         connect: {
//           id: data?.paletteId,
//         },
//       },
//       id: data?.id,
//     },
//   });
// };

// export const deleteParcel = async (where: any): Promise<Parcel | null> => {
//   return db.parcel.delete({
//     where: {
//       id: where?.id,
//     },
//   });
// };
