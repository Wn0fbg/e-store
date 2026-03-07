import database from "../database/db.js";

export async function createTokenStoreTable() {
  try {
    const query = `
       CREATE TABLE IF NOT EXISTS token_store (
         id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
         user_id UUID NOT NULL,
         token TEXT NOT NULL,
         expires_at TIMESTAMPTZ NOT NULL,
         created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

         CONSTRAINT fk_token_user FOREIGN KEY (user_id)
         REFERENCES users (id)
         ON DELETE CASCADE
);
    `;
    await database.query(query);
  } catch (error) {
    console.error("Failed to create token store table", error);
    process.exit(1);
  }
}
