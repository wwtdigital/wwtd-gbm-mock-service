import { NextRequest, NextResponse } from "next/server";
import { getThread } from "../../../../src/store.js";
import { formatThread } from "../../../../src/utils.js";
import {
  addCorsHeaders,
  createErrorResponse,
  logRequest,
} from "../../../../src/middleware.js";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const startTime = Date.now();
  logRequest(request, startTime);

  try {
    const thread = getThread(params.id);
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