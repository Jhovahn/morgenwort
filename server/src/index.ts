import "dotenv/config";
import { app } from "./app.js";

const PORT = process.env.PORT ? Number(process.env.PORT) : 8787;

app.listen(PORT, () => {
  console.log(`Morgenwort API listening on http://localhost:${PORT}`);
});
