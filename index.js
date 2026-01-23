import express from "express";
import neo4j from "neo4j-driver";

const app = express();
app.use(express.json());

// ⚠️ 改成你自己的 Aura 資訊
const driver = neo4j.driver(
  "neo4j+s://2f4ad74f.databases.neo4j.io",
  neo4j.auth.basic("neo4j", "985632147")
);

app.post("/query", async (req, res) => {
  const { cypher, params } = req.body;

  if (!cypher) {
    return res.status(400).json({ error: "cypher is required" });
  }

  const session = driver.session();
  try {
    const result = await session.run(cypher, params || {});
    res.json(result.records.map(r => r.toObject()));
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
