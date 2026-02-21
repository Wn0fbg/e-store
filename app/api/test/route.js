import pool from "@/lib/databaseConnection.js";
import { NextResponse } from "next/server";

export async function GET() {
  await pool();
  return NextResponse.json({
    success: true,
    message: "connection success",
  });
}
