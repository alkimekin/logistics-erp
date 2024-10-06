import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import xmlparser from "express-xml-bodyparser";

import { arrivalRouter } from "./routers/arrival";
import { productRouter } from "./routers/product";
import { storageRouter } from "./routers/storage";
import { dispatchRouter } from "./routers/dispatch";
import { authRouter } from "./routers/auth";
import { orderRouter } from "./routers/order";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(cors());
app.use(
  express.urlencoded({
    limit: "5mb",
    verify: (req: any, res, buf) => {
      req.rawBody = buf.toString();
    },
    extended: true,
  })
);

app.use(
  express.json({
    limit: "5mb",
    verify: (req: any, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

app.use(xmlparser());

app.use("/api/auth", authRouter);
app.use("/api/arrival", arrivalRouter);
app.use("/api/product", productRouter);
app.use("/api/storage", storageRouter);
app.use("/api/dispatch", dispatchRouter);
app.use("/api/order", orderRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
