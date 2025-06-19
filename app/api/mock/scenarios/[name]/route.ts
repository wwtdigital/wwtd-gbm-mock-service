import { NextRequest, NextResponse } from "next/server";
import {
  addCorsHeaders,
  createErrorResponse,
  logRequest,
} from "../../../../../src/middleware.js";
import { conversationScenarios } from "../../../../../src/mock-responses.js";

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  const startTime = Date.now();
  logRequest(request, startTime);

  const scenario = conversationScenarios.find(s => s.name === params.name);
  if (!scenario) {
    return addCorsHeaders(
      createErrorResponse("Scenario not found", request, 404, "SCENARIO_NOT_FOUND")
    );
  }

  const response = NextResponse.json(scenario);
  return addCorsHeaders(response);
}