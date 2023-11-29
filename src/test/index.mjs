import neo4j from "neo4j-driver";
import dotenv from "dotenv";
import path from "path";

dotenv.config();
const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASS)
);
const session = driver.session();
const result = await session.run(`
MATCH p=()-[]->()
RETURN p
`);
console.log(result.records);
await session.close();

await driver.close();
