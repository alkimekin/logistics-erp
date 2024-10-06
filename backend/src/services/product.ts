// import { db } from "../util/db";

// export type Product = {
//   serialNumber: string;
//   baseProductId?: number | null;
//   barcodeNumber: string | null;
//   gtinNumber: string;
//   lotNumber: number;
//   productionDate: string | null;
//   expirationDate: string | null;
//   parcelId?: string | null;
//   createdAt?: Date;
//   updatedAt?: Date;
// };

// export const isProductExist = async (serialNumber: string) => {
//   const productExist = await db.product.count({
//     where: {
//       serialNumber: serialNumber,
//     },
//   });

//   if (productExist) return true;
//   else return false;
// };

// export const createProduct = async (data: any): Promise<Product | null> => {
//   return db.product.create({
//     data: {
//       serialNumber: data?.serialNumber,
//       barcodeNumber: data?.barcodeNumber,
//       gtinNumber: data?.gtinNumber,
//       lotNumber: data?.lotNumber,
//       productionDate: data?.productionDate,
//       expirationDate: data?.expirationDate,
//     },
//     select: {
//       baseProduct: true,
//       serialNumber: true,
//       barcodeNumber: true,
//       gtinNumber: true,
//       lotNumber: true,
//       productionDate: true,
//       expirationDate: true,
//       parcelId: true,
//     },
//   });
// };

// export const createProductWithParcel = async (
//   data: any
// ): Promise<Product | null> => {
//   return db.product.create({
//     data: {
//       serialNumber: data?.serialNumber,
//       barcodeNumber: data?.barcodeNumber,
//       gtinNumber: data?.gtinNumber,
//       lotNumber: data?.lotNumber,
//       productionDate: data?.productionDate,
//       expirationDate: data?.expirationDate,
//       parcel: {
//         connect: {
//           id: data?.parcelId,
//         },
//       },
//     },
//     select: {
//       baseProduct: true,
//       serialNumber: true,
//       barcodeNumber: true,
//       gtinNumber: true,
//       lotNumber: true,
//       productionDate: true,
//       expirationDate: true,
//       parcelId: true,
//     },
//   });
// };

// export const createProductWithBaseProduct = async (
//   data: any
// ): Promise<Product | null> => {
//   return db.product.create({
//     data: {
//       baseProduct: {
//         connect: {
//           id: data?.baseProductId,
//         },
//       },
//       serialNumber: data?.serialNumber,
//       barcodeNumber: data?.barcodeNumber,
//       gtinNumber: data?.gtinNumber,
//       lotNumber: data?.lotNumber,
//       productionDate: data?.productionDate,
//       expirationDate: data?.expirationDate,
//     },
//     select: {
//       baseProduct: true,
//       serialNumber: true,
//       barcodeNumber: true,
//       gtinNumber: true,
//       lotNumber: true,
//       productionDate: true,
//       expirationDate: true,
//       parcelId: true,
//     },
//   });
// };

// export const createProductWithBaseProductAndParcel = async (
//   data: any
// ): Promise<Product | null> => {
//   return db.product.create({
//     data: {
//       baseProduct: {
//         connect: {
//           id: data?.baseProductId,
//         },
//       },
//       serialNumber: data?.serialNumber,
//       barcodeNumber: data?.barcodeNumber,
//       gtinNumber: data?.gtinNumber,
//       lotNumber: data?.lotNumber,
//       productionDate: data?.productionDate,
//       expirationDate: data?.expirationDate,
//       parcel: {
//         connect: {
//           id: data?.parcelId,
//         },
//       },
//     },
//     select: {
//       baseProduct: true,
//       serialNumber: true,
//       barcodeNumber: true,
//       gtinNumber: true,
//       lotNumber: true,
//       productionDate: true,
//       expirationDate: true,
//       parcelId: true,
//     },
//   });
// };

// export const readProduct = async (
//   serialNumber: string
// ): Promise<Product | null> => {
//   return db.product.findUnique({
//     where: {
//       serialNumber: serialNumber,
//     },
//     select: {
//       baseProduct: true,
//       serialNumber: true,
//       barcodeNumber: true,
//       gtinNumber: true,
//       lotNumber: true,
//       productionDate: true,
//       expirationDate: true,
//       parcelId: true,
//     },
//   });
// };

// export const readFilteredProducts = async (where: any): Promise<Product[]> => {
//   return db.product.findMany({
//     where: where,
//     select: {
//       baseProduct: true,
//       serialNumber: true,
//       barcodeNumber: true,
//       gtinNumber: true,
//       lotNumber: true,
//       productionDate: true,
//       expirationDate: true,
//       parcelId: true,
//     },
//   });
// };

// export const readAllProducts = async (): Promise<Product[]> => {
//   return db.product.findMany({
//     select: {
//       baseProduct: true,
//       serialNumber: true,
//       barcodeNumber: true,
//       gtinNumber: true,
//       lotNumber: true,
//       productionDate: true,
//       expirationDate: true,
//       parcelId: true,
//     },
//   });
// };

// export const updateProduct = async (
//   serialNumber: string,
//   data: any
// ): Promise<Product | null> => {
//   return db.product.update({
//     where: {
//       serialNumber: serialNumber,
//     },
//     data: {
//       baseProduct: {
//         connect: {
//           id: data?.baseProductId,
//         },
//       },
//       serialNumber: data?.serialNumber,
//       barcodeNumber: data?.barcodeNumber,
//       gtinNumber: data?.gtinNumber,
//       lotNumber: data?.lotNumber,
//       productionDate: data?.productionDate,
//       expirationDate: data?.expirationDate,
//       parcel: {
//         connect: {
//           id: data?.parcelId,
//         },
//       },
//     },
//     select: {
//       baseProduct: true,
//       serialNumber: true,
//       barcodeNumber: true,
//       gtinNumber: true,
//       lotNumber: true,
//       productionDate: true,
//       expirationDate: true,
//       parcelId: true,
//     },
//   });
// };

// export const updateProductWithParcel = async (
//   serialNumber: string,
//   data: any
// ): Promise<Product | null> => {
//   return db.product.update({
//     where: {
//       serialNumber: serialNumber,
//     },
//     data: {
//       serialNumber: data?.serialNumber,
//       barcodeNumber: data?.barcodeNumber,
//       gtinNumber: data?.gtinNumber,
//       lotNumber: data?.lotNumber,
//       productionDate: data?.productionDate,
//       expirationDate: data?.expirationDate,
//       parcel: {
//         connect: {
//           id: data?.parcelId,
//         },
//       },
//     },
//     select: {
//       baseProduct: true,
//       serialNumber: true,
//       barcodeNumber: true,
//       gtinNumber: true,
//       lotNumber: true,
//       productionDate: true,
//       expirationDate: true,
//       parcelId: true,
//     },
//   });
// };

// export const deleteProduct = async (
//   serialNumber: string
// ): Promise<Product | null> => {
//   return db.product.delete({
//     where: {
//       serialNumber: serialNumber,
//     },
//     select: {
//       baseProduct: true,
//       serialNumber: true,
//       barcodeNumber: true,
//       gtinNumber: true,
//       lotNumber: true,
//       productionDate: true,
//       expirationDate: true,
//       parcelId: true,
//     },
//   });
// };

// export const deleteAllProducts = async () => {
//   return db.product.deleteMany();
// };
