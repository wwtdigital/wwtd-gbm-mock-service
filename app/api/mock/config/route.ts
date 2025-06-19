import { NextRequest, NextResponse } from "next/server";
import {
  addCorsHeaders,
  logRequest,
} from "../../../../src/middleware.js";
import { config } from "../../../../src/config.js";

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  logRequest(request, startTime);

  const mockConfig = {
    mockResponseMode: config.mockResponseMode,
    enableSmartResponses: config.enableSmartResponses,
    enableDelayVariation: config.enableDelayVariation,
    enableRichContent: config.enableRichContent,
    defaultDelayMs: config.defaultDelayMs,
    maxDelayMs: config.maxDelayMs,
  };

  const response = NextResponse.json(mockConfig);
  return addCorsHeaders(response);
}