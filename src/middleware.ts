import { type NextRequest, NextResponse } from "next/server";
import { config } from "./config.js";

// Standard error response format
export interface ErrorResponse {
  error: string;
  message?: string;
  code?: string;
  timestamp: string;
  path: string;
}

export function createErrorResponse(
  error: string,
  request: NextRequest,
  status = 500,
  code?: string,
  message?: string,
): NextResponse {
  const errorResponse: ErrorResponse = {
    error,
    message,
    code,
    timestamp: new Date().toISOString(),
    path: request.nextUrl.pathname,
  };

  return NextResponse.json(errorResponse, { status });
}

// CORS middleware
export function addCorsHeaders(response: NextResponse): NextResponse {
  if (!config.corsEnabled) return response;

  const origins = config.corsOrigins.includes("*")
    ? "*"
    : config.corsOrigins.join(",");

  response.headers.set("Access-Control-Allow-Origin", origins);
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );
  response.headers.set("Access-Control-Max-Age", "86400");

  return response;
}

// Request logging
export function logRequest(request?: NextRequest, startTime?: number): void {
  if (config.logLevel === "none" || !request) return;

  const method = request.method;
  const url = request.nextUrl.pathname + request.nextUrl.search;
  const timestamp = new Date().toISOString();

  if (config.logLevel === "basic") {
    console.log(`[${timestamp}] ${method} ${url}`);
  } else if (config.logLevel === "detailed") {
    const duration = startTime ? `${Date.now() - startTime}ms` : "";
    const userAgent = request.headers.get("user-agent") || "unknown";
    console.log(`[${timestamp}] ${method} ${url} ${duration} - ${userAgent}`);
  }
}

// Delay simulation middleware
export async function handleDelay(request: NextRequest): Promise<void> {
  const delayParam = request.nextUrl.searchParams.get("delayMs");
  const delay = delayParam ? Number(delayParam) : config.defaultDelayMs;

  if (delay > 0) {
    const actualDelay = Math.min(delay, config.maxDelayMs);
    await new Promise((resolve) => setTimeout(resolve, actualDelay));
  }
}

// Error simulation middleware
export function checkForceError(request: NextRequest): NextResponse | null {
  const forcedError = request.nextUrl.searchParams.get("error");
  if (forcedError) {
    const status = Number(forcedError);
    return createErrorResponse("forced error", request, status, "FORCED_ERROR");
  }
  return null;
}
