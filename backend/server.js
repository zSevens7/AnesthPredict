const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Backend online!" });
});

app.listen(3000, () => console.log("🚀 Backend rodando na porta 3000"));
