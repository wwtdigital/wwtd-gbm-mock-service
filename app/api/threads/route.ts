import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import {
  appendToThread,
  createThread,
  listThreads,
} from "@/src/store";
import {
  type ThreadRequest,
  ThreadRequestSchema,
} from "@/src/types";
import { formatThread } from "@/src/utils";
import {
  addCorsHeaders,
  checkForceError,
  createErrorResponse,
  handleDelay,
  logRequest,
} from "@/src/middleware-utils";
import {
  createAssistantResponse,
  trackResponse,
} from "@/src/response-generator";

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  logRequest(request, startTime);

  // Check for forced error
  const errorResponse = checkForceError(request);
  if (errorResponse) {
    return addCorsHeaders(errorResponse);
  }

  // Handle delay simulation
  await handleDelay(request);

  try {
    const body = await request.json();
    const parse = ThreadRequestSchema.safeParse(body);
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

    const threadRequest: ThreadRequest = parse.data;
    const { threadId, userId, message } = threadRequest;

    const thread = threadId ? appendToThread(threadId, message) : undefined;
    if (threadId && !thread) {
      return addCorsHeaders(
        createErrorResponse("Thread not found", request, 404, "THREAD_NOT_FOUND")
      );
    }

    const updated = thread ?? createThread(userId, message);

    // Generate intelligent assistant response
    const conversationHistory = updated.entries.map(entry => entry.data);
    const generatedResponse = createAssistantResponse(
      message,
      updated.threadId,
      conversationHistory
    );
    
    // Track analytics
    trackResponse(generatedResponse);
    
    // Apply additional delay if specified by response generator
    if (generatedResponse.delayMs > 0) {
      await new Promise(resolve => setTimeout(resolve, generatedResponse.delayMs));
    }

    // Create assistant response entry
    const assistantEntry = {
      entryId: uuid(),
      threadId: updated.threadId,
      category: "response" as const,
      data: {
        role: "assistant" as const,
        content: generatedResponse.content,
      },
      createdAt: new Date().toISOString(),
    };
    updated.entries.push(assistantEntry);

    const response = NextResponse.json(formatThread(updated));
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

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  logRequest(request, startTime);

  try {
    const arr = listThreads().map(formatThread);
    const response = NextResponse.json(arr);
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