import neo4j from "neo4j-driver";
export async function createLog(session, rows) {
  const result = await session.run(
    `
    UNWIND $rows AS row
    MERGE (s:Sewadar { token: row['Nominal Roll Token'] })
    ON CREATE SET s.dateOfEntry = row['Date Of Entry'], s.sewaType = row['Sewa Type'], s.reportingDate = row['Reporting Date at Sewa'],
    s.reportingTime = row['Tentative Reporting Time at Sewa'], s.remarks = row.remarks, s.fromDate = row['From Date'], s.toDate = row['To Date']
    `,
    { rows }
  );
  console.log(
    "Sewadar created:",
    result.summary.counters.updates().nodesCreated
  );
}
export async function createSewa(session, rows) {
  const result = await session.run(
    `
    UNWIND $rows AS row
    MERGE (sewa:Sewa { name: row['Sewa Name']})
    `,
    { rows }
  );
  console.log("Sewa created:", result.summary.counters.updates().nodesCreated);
}
export async function createDepartment(session, rows) {
  const result = await session.run(
    `
    UNWIND $rows AS row
    MERGE (dept:Department { name: row.Department })
    `,
    { rows }
  );
  console.log(
    "Department created:",
    result.summary.counters.updates().nodesCreated
  );
}
export async function createCenter(session, rows) {
  const result = await session.run(
    `
    UNWIND $rows AS row
    MERGE (centre:Centre { name: row['Centre Name'] })
    `,
    { rows }
  );
  console.log(
    "Center created:",
    result.summary.counters.updates().nodesCreated
  );
}
export async function createParticipatesIn(session, rows) {
  const result = await session.run(
    `
    UNWIND $rows AS row
    MATCH (sewadar:Sewadar { token: row['Nominal Roll Token']}), (sewa:Sewa { name: row['Sewa Name']  })
    MERGE (sewadar)-[rel:PARTICIPATES_IN { days: toInteger(row['No. Of Days']),
                                         sewadars: toInteger(row['No. Of Sewadars']),
                                         manDays: toInteger(row['Man Days'])}]->(sewa)
                                         RETURN count(rel) AS createdCount
    `,
    { rows }
  );
  console.log(
    "ParticipatedIn created:",
    result.summary.counters.updates().relationshipsCreated
  );
}

export async function createOrganizedBy(session, rows) {
  const result = await session.run(
    `
    UNWIND $rows AS row
    MATCH (sewa:Sewa { name: row['Sewa Name']}), (dept:Department { name: row.Department })
    MERGE (sewa)-[rel:ORGANIZED_BY]->(dept)
    RETURN count(rel) AS createdCount
    `,
    { rows }
  );
  console.log(
    "OrganizedBy created:",
    result.summary.counters.updates().relationshipsCreated
  );
}
export async function createHeldAt(session, rows) {
  const result = await session.run(
    `
    UNWIND $rows AS row
    MATCH (sewa:Sewa { name: row['Sewa Name']}), (centre:Centre { name: row['Centre Name'] })
    MERGE (sewa)-[rel:HELD_AT]->(centre)
    RETURN count(rel) AS createdCount
    `,
    { rows }
  );
  console.log(
    "HeldAt created:",
    result.summary.counters.updates().relationshipsCreated
  );
}
export async function handleQuery(query) {
  const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASS)
  );
  const session = driver.session();
  let result;
  try {
    result = await session.run(query);
  } catch (e) {
    console.log(e);
  }
  await session.close();
  await driver.close();
  return result;
}
