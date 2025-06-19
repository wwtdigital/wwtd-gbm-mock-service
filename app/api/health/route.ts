import { NextRequest, NextResponse } from "next/server";
import { addCorsHeaders, logRequest } from "../../../src/middleware.js";

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  logRequest(request, startTime);

  const response = NextResponse.json({ 
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });

  return addCorsHeaders(response);
}