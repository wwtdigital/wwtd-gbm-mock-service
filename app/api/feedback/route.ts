import { NextRequest, NextResponse } from "next/server";
import { createFeedback, getThread } from "../../../src/store.js";
import {
  FeedbackRequestSchema,
} from "../../../src/types.js";
import {
  addCorsHeaders,
  createErrorResponse,
  logRequest,
} from "../../../src/middleware.js";

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  logRequest(request, startTime);

  try {
    const body = await request.json();
    const parse = FeedbackRequestSchema.safeParse(body);
    if (!parse.success) {
      return addCorsHeaders(
        createErrorResponse(
          "Invalid request body",
          request,
          400,
          "VALIDATION_ERROR",
          JSON.stringify(parse.error.format())
        )
      );
    }

    const { entryId, threadId, userId, rating, comment } = parse.data;

    // Verify thread and entry exist
    const thread = getThread(threadId);
    if (!thread) {
      return addCorsHeaders(
        createErrorResponse("Thread not found", request, 404, "THREAD_NOT_FOUND")
      );
    }

    const entry = thread.entries.find((e) => e.entryId === entryId);
    if (!entry) {
      return addCorsHeaders(
        createErrorResponse("Entry not found", request, 404, "ENTRY_NOT_FOUND")
      );
    }

    const feedback = createFeedback(entryId, threadId, userId, rating, comment);

    const response = NextResponse.json(
      {
        id: feedback.id,
        feedback_id: feedback.feedbackId,
        entry_id: feedback.entryId,
        thread_id: feedback.threadId,
        user_id: feedback.userId,
        rating: feedback.rating,
        comment: feedback.comment,
        created_at: feedback.createdAt,
      },
      { status: 201 },
    );
    
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