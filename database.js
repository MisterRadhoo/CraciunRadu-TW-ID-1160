import { Sequelize } from "sequelize";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "database.db");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: dbPath,
  logging: false,
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("@@ Conexiune reusita la baza de date.");
  } catch (err) {
    console.error("Erroare de conexine la DB:", err);
  }
};
testConnection();

export default sequelize;
