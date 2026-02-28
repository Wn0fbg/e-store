import pkg from "pg";

const { Client } = pkg;

const database = new Client({
  user: "postgres",
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: "12345678",
  port: process.env.DB_PORT,
});

try {
  await database.connect();
  console.log("Connected to the database");
} catch (error) {
  console.error("Database connected failed", error);
  process.exit(1);
}

export default database;
