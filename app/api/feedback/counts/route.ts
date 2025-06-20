import { NextRequest, NextResponse } from "next/server";
import { listFeedback } from "@/src/store";
import { addCorsHeaders, logRequest } from "@/src/middleware-utils";

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  logRequest(request, startTime);

  try {
    const allFeedback = listFeedback();
    
    // Count thumbs up and thumbs down
    const thumbsUp = allFeedback.filter(f => f.rating === "thumbs_up").length;
    const thumbsDown = allFeedback.filter(f => f.rating === "thumbs_down").length;
    
    const response = NextResponse.json({
      thumbs_up: thumbsUp,
      thumbs_down: thumbsDown,
      total: allFeedback.length
    });
    
    return addCorsHeaders(response);
  } catch (error) {
    const errorResponse = NextResponse.json(
      { 
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
    
    return addCorsHeaders(errorResponse);
  }
}
