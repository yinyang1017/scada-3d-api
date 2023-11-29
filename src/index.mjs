import neo4j from "neo4j-driver";
import dotenv from "dotenv";
import path from "path";
import {
  createLog,
  createCenter,
  createDepartment,
  createHeldAt,
  createOrganizedBy,
  createParticipatesIn,
  createSewa,
} from "./lib/neo4j.mjs";
import { importCSV } from "./lib/csv.mjs";

dotenv.config();
const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASS)
);
const session = driver.session();
const file = path.resolve("static", "Oct-Dec22.csv");
const result = await importCSV(file);
await createLog(session, result);
await createCenter(session, result);
await createDepartment(session, result);
await createSewa(session, result);
await createParticipatesIn(session, result);
await createOrganizedBy(session, result);
await createHeldAt(session, result);
await session.close();

await driver.close();
