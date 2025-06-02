const express = require("express");
const router = express.Router();
const pool = require("../db");
const { scheduleProgramari } = require("../jobs/programare")

//creeaza o programare
router.post("/programari", async (req, res) => {
  try {
    const programari = req.body;

    for (const p of programari) {
      const { date, hour, minute, duration } = p;

      console.log("➡️ Primit:", p);

      if (!date || hour == null || minute == null || duration == null) {
        console.warn("⚠️ Programare incompletă, ignorată:", p);
        continue;
      }

      await pool.query(
        `INSERT INTO programari(date, hour, minute, duration) VALUES($1, $2, $3, $4)`,
        [date, hour, minute, duration]
      );
    }

    await scheduleProgramari();
    res.status(201).json({ message: "Programările au fost procesate." });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Eroare la adăugare programări." });
  }
});
//GET toate programariile
router.get("/programari", async (req, res) => {
  try {
    const toateProgramarile = await pool.query("SELECT * FROM programari");
    res.json(toateProgramarile.rows);
    await scheduleProgramari();
  } catch (err) {
    console.error(err.message);
  }
});
//GET o programare
router.get("/programari/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const programare = await pool.query(
      "SELECT * FROM programari WHERE programari_id=$1",
      [id]
    );
    await scheduleProgramari();
    res.json(programare.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//actualizeaza o programare

router.put("/programari/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { date, hour, minute, duration } = req.body;
    const updateProgramari = await pool.query(
      "UPDATE programari SET date = $1, hour = $2, minute = $3, duration = $4 WHERE programari_id = $5",
      [date, hour, minute, duration, id]
    );
    await scheduleProgramari();
    res.json("Programari a fost actualizat");
  } catch (err) {
    console.error(err);
  }
});

//sterge o programare

router.delete("/programari/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const programare = await pool.query(
      "DELETE FROM programari WHERE programari_id=$1",
      [id]
    );
    await scheduleProgramari();
    res.json(`Programarea ${id} was deleted!`);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router