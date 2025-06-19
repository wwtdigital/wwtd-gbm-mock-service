import { NextRequest, NextResponse } from "next/server";
import {
  addCorsHeaders,
  logRequest,
} from "@/src/middleware-utils";
import {
  getResponseAnalytics,
  resetResponseAnalytics,
} from "@/src/response-generator";

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  logRequest(request, startTime);

  const analytics = getResponseAnalytics();
  const response = NextResponse.json(analytics);
  return addCorsHeaders(response);
}

export async function DELETE(request: NextRequest) {
  const startTime = Date.now();
  logRequest(request, startTime);

  resetResponseAnalytics();
  const response = NextResponse.json({ 
    message: "Analytics reset successfully",
    timestamp: new Date().toISOString(),
  });
  return addCorsHeaders(response);
}