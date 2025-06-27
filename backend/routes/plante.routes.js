const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/plante", async (req, res) => {
  try {
    const plante = Array.isArray(req.body) ? req.body : [req.body];

    for (const p of plante) {
      const { name, image, humidity, airHumidity, brightness, temperature } = p;
        
      console.log("Primit:", p);

    

      await pool.query(
        `INSERT INTO plante(nume, imagine, umiditate_sol, umiditate_aer, luminozitate, temperatura) VALUES($1, $2, $3, $4, $5, $6)`,
        [name, image, humidity, airHumidity, brightness, temperature]
      );
    }
    res.status(201).json({ message: "Plantele au fost procesate." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Eroare la adăugare plante." });
  }
});

//GET toate plantele
router.get("/plante", async (req, res) => {
  try {
    const toatePlantele = await pool.query("SELECT * FROM plante");
    res.json(toatePlantele.rows);

  } catch (err) {
    console.error(err.message);
  }
});


//sterge o planta

router.delete("/plante/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const planta = await pool.query(
      "DELETE FROM plante WHERE plante_id=$1",
      [id]
    );
    res.json(`Planta ${id} was deleted!`);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
