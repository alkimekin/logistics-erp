import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const baseProducts = [
  {
    id: 1,
    manufacturer: "Sanovel",
    name: "ATOR 40 MG",
  },
  {
    id: 2,
    manufacturer: "Sanovel",
    name: "ARYA PLUS 16-12.5 MG",
  },
  {
    id: 3,
    manufacturer: "Sanovel",
    name: "CARDOPAN PLUS 320-12,5 MG",
  },
  {
    id: 4,
    manufacturer: "Sanovel",
    name: "NIMES COMBO %1-%0,25 JEL",
  },
  {
    id: 5,
    manufacturer: "Farmavip",
    name: "FLOXAPEN 500 MG",
  },
];

const hangars = [
  {
    id: 1,
    name: "Satis",
  },
  {
    id: 2,
    name: "Karantina",
  },
];

const racks = [
  {
    id: 3510,
    hangarId: 1,
  },
  {
    id: 3511,
    hangarId: 1,
  },
  {
    id: 3512,
    hangarId: 1,
  },
  {
    id: 3513,
    hangarId: 1,
  },
  {
    id: 3514,
    hangarId: 1,
  },
  {
    id: 3515,
    hangarId: 1,
  },
  {
    id: 3516,
    hangarId: 1,
  },
  {
    id: 3517,
    hangarId: 1,
  },
  {
    id: 3518,
    hangarId: 1,
  },
  {
    id: 3519,
    hangarId: 1,
  },
  {
    id: 3520,
    hangarId: 2,
  },
  {
    id: 3521,
    hangarId: 2,
  },
  {
    id: 3522,
    hangarId: 2,
  },
  {
    id: 3523,
    hangarId: 2,
  },
  {
    id: 3524,
    hangarId: 2,
  },
];

async function main() {
  for (const baseProduct of baseProducts) {
    await prisma.baseProduct.upsert({
      where: { id: baseProduct.id },
      update: {},
      create: {
        id: baseProduct.id,
        manufacturer: baseProduct.manufacturer,
        name: baseProduct.name,
      },
    });
  }

  for (const hangar of hangars) {
    await prisma.hangar.upsert({
      where: { id: hangar.id },
      update: {},
      create: {
        id: hangar.id,
        name: hangar.name,
      },
    });
  }

  for (const rack of racks) {
    await prisma.rack.upsert({
      where: { id: rack.id },
      update: {},
      create: {
        id: rack.id,
        hangarId: rack.hangarId,
      },
    });
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
