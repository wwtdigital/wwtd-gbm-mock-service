import { NextRequest, NextResponse } from "next/server";
import { getFeedbackByThread } from "@/src/store";
import { addCorsHeaders, createErrorResponse, logRequest } from "@/src/middleware-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const startTime = Date.now();
  logRequest(request, startTime);

  try {
    const { id } = await params;
    
    // Get feedback for the thread ID directly
    const threadFeedback = getFeedbackByThread(id);
    
    // Count thumbs up and thumbs down
    const thumbsUp = threadFeedback.filter(f => f.rating === "thumbs_up").length;
    const thumbsDown = threadFeedback.filter(f => f.rating === "thumbs_down").length;
    
    const response = NextResponse.json({
      thread_id: id,
      thumbs_up: thumbsUp,
      thumbs_down: thumbsDown,
      total: threadFeedback.length
    });
    
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
