import pool from "@/lib/databaseConnection";
import { zSchema } from "@/lib/zodSchema";

export async function POST(reqest) {
    try {
        await pool()
        const validationSchema = zSchema.pick({})
    } catch (err) {

    }
}