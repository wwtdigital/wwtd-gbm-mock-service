import { NextRequest, NextResponse } from "next/server";
import {
  addCorsHeaders,
  logRequest,
} from "../../../../src/middleware.js";
import { conversationScenarios } from "../../../../src/mock-responses.js";

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  logRequest(request, startTime);

  const scenarios = conversationScenarios.map(scenario => ({
    name: scenario.name,
    description: scenario.description,
    exchangeCount: scenario.exchanges.length,
  }));

  const response = NextResponse.json({
    scenarios,
    total: scenarios.length,
  });
  return addCorsHeaders(response);
}