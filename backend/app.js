const express = require("express");
const cors = require("cors");
const app = express();
const programariRoutes = require("./routes/programari.routes");

app.use(cors());
app.use(express.json());

app.use("/api", programariRoutes);

module.exports = app;