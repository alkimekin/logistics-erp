import { db } from "../util/db";

type BaseProduct = {
  id: number;
  manufacturer: string;
  name: string;
};

export const createBaseProduct = async (
  data: any
): Promise<BaseProduct | null> => {
  return db.baseProduct.create({
    data: {
      manufacturer: data?.manufacturer,
      name: data?.name,
    },
    select: {
      id: true,
      manufacturer: true,
      name: true,
    },
  });
};

export const readAllBaseProducts = async (): Promise<BaseProduct[]> => {
  return db.baseProduct.findMany({
    select: {
      id: true,
      manufacturer: true,
      name: true,
    },
  });
};

export const readBaseProductWithId = async (
  id: number
): Promise<BaseProduct | null> => {
  return db.baseProduct.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      manufacturer: true,
      name: true,
    },
  });
};

export const updateBaseProductWithId = async (
  id: number,
  data: any
): Promise<BaseProduct | null> => {
  return db.baseProduct.update({
    where: {
      id: id,
    },
    data: {
      manufacturer: data?.manufacturer,
      name: data?.name,
    },
    select: {
      id: true,
      manufacturer: true,
      name: true,
    },
  });
};

export const deleteBaseProductWithId = async (
  id: number
): Promise<BaseProduct | null> => {
  return db.baseProduct.delete({
    where: {
      id: id,
    },
    select: {
      id: true,
      manufacturer: true,
      name: true,
    },
  });
};
