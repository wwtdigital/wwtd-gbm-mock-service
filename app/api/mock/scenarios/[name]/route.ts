import { NextRequest, NextResponse } from "next/server";
import {
  addCorsHeaders,
  createErrorResponse,
  logRequest,
} from "@/src/middleware";
import { conversationScenarios } from "@/src/mock-responses";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const startTime = Date.now();
  logRequest(request, startTime);

  const { name } = await params;
  const scenario = conversationScenarios.find(s => s.name === name);
  if (!scenario) {
    return addCorsHeaders(
      createErrorResponse("Scenario not found", request, 404, "SCENARIO_NOT_FOUND")
    );
  }

  const response = NextResponse.json(scenario);
  return addCorsHeaders(response);
}