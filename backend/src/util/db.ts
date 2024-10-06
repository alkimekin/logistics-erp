import { PrismaClient } from "@prisma/client";

let db: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}

if (!global.__db) {
  global.__db = new PrismaClient({
    log: [{ emit: "event", level: "query" }],
  });
}

db = global.__db;

db.$connect()
  .then(() => console.log("App connected to database"))
  .catch(() => {
    console.log("An error occured while connecting to database");
  });

export { db };
