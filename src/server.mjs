import express, { query } from "express";
import bodyParser from "body-parser";
import { handleQuery } from "./lib/neo4j.mjs";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors());
const router = express.Router();

router.post("/query", async (req, res, next) => {
  const body = req.body;
  console.log(body);
  const result = await handleQuery(body.query);
  res.status(200).json({ status: "success", result });
});
app.use(router);
app.listen(8000, () => {
  console.log("Listening.....");
});
