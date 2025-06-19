import { NextRequest, NextResponse } from "next/server";
import { getThread } from "../../../../src/store";
import { formatThread } from "../../../../src/utils";
import {
  addCorsHeaders,
  createErrorResponse,
  logRequest,
  handleDelay as delayResponse,
  checkForceError as forceError,
} from "../../../../src/middleware";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const startTime = Date.now();
  logRequest(request, startTime);

  try {
    const { id } = await params;
    const thread = getThread(id);
    if (!thread) {
      return addCorsHeaders(
        createErrorResponse("Thread not found", request, 404, "THREAD_NOT_FOUND")
      );
    }
    
    const response = NextResponse.json(formatThread(thread));
    return addCorsHeaders(response);
  } catch (error) {
    return addCorsHeaders(
      createErrorResponse(
        "Internal server error",
        request,
        500,
        "INTERNAL_ERROR",
        error instanceof Error ? error.message : "Unknown error"
      )
    );
  }
}