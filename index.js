import express from "express";
import neo4j from "neo4j-driver";

const app = express();
app.use(express.json());

// ⚠️ 改成你自己的 Aura 資訊
// const driver = neo4j.driver(
//   "neo4j+s://38f7eb26.databases.neo4j.io",
//   neo4j.auth.basic("neo4j", "iTTNaxjXQbJ_gtlHhgIv1ri7MnAFqiB32dw-S5WdDhc")
// );
const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(
    process.env.NEO4J_USER,
    process.env.NEO4J_PASSWORD
  )
);

// app.post("/query", async (req, res) => {
//   const { cypher, params } = req.body;

//   if (!cypher) {
//     return res.status(400).json({ error: "cypher is required" });
//   }

//   const session = driver.session();
//   try {
//     const result = await session.run(cypher, params || {});
//     res.json(result.records.map(r => r.toObject()));
//   } catch (e) {
//     res.status(500).json({ error: e.message });
//   } finally {
//     await session.close();
//   }
// });

app.post("/query", async (req, res) => {
  const { cypher, params } = req.body;
  if (!cypher) {
    return res.status(400).json({ error: "cypher is required" });
  }
  const session = driver.session();
  try {
    const result = await session.run(cypher, params || {});
    const data = result.records.map(r => r.toObject());
    res.json({ 
      data: data,
      count: data.length,
      hasResults: data.length > 0
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  } finally {
    await session.close();
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
