import database from "../database/db.js";

export async function createPaymentsTable() {
  try {
    const query = `
        CREATE TABLE IF NOT EXISTS payments (
           id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
           order_id UUID NOT NULL UNIQUE,
           payment_type VARCHAR(20) NOT NULL CHECK (payment_type IN ('Online')),
           payment_status VARCHAR(20) NOT NULL CHECK (payment_type IN (
             'Paid',
             'Pending', 
             'Failed')),
           payment_intent_id VARCHAR(255) UNIQUE,
           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
           FOREIGN KEY (order_id) REFERENCES order(id) ON DELETE CASCADE    
        )`;
    await database.query(query);
  } catch (error) {
    console.error("Failed to create payments table", error);
    process.exit(1);
  }
}
