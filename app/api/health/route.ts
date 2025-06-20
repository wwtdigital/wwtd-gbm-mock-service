import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ 
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  }, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}