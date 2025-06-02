const pool = require("../db");
const fs = require("fs");
const path = require("path");
const { broadcastMessage } = require("../websocket");

const pad = (n) => (n < 10 ? "0" + n : n);

const finalizeazaProgramare = async (id) => {
  try {
    await pool.query("DELETE FROM programari WHERE programari_id = $1", [id]);
  } catch (err) {
    console.error(`Eroare la ștergerea programării #${id}:`, err.message);
  }
};

let programariSterse = new Set();

const scheduleProgramari = async () => {
  try {
    const result = await pool.query("SELECT * FROM programari");
    const programari = result.rows;

    for (const p of programari) {
      const { date, hour, minute, duration, programari_id } = p;
      const startTime = new Date(`${date}T${pad(hour)}:${pad(minute)}:00`);
      const msPanaLaStart = startTime.getTime() - Date.now();

      if (msPanaLaStart > 0) {
        setTimeout(() => {
          broadcastMessage("1");
          setTimeout(() => {
            broadcastMessage("0");
            finalizeazaProgramare(programari_id);
            programariSterse.delete(programari_id); // curăță după execuție
          }, duration * 1000);
        }, msPanaLaStart);
      } else {
        if (!programariSterse.has(programari_id)) {
          await finalizeazaProgramare(programari_id);
          programariSterse.add(programari_id);
        }
      }
    }
  } catch (err) {
    console.error("Eroare la programarea udărilor:", err.message);
  }
};

module.exports = {
  scheduleProgramari,
};