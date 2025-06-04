const express = require("express");
const cors = require("cors");
const app = express();
const programariRoutes = require("./routes/programari.routes");
const planteRoutes = require("./routes/plante.routes")

app.use(cors());
app.use(express.json());

app.use("/api", programariRoutes, planteRoutes);

module.exports = app;