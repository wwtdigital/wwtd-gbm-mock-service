import { NextRequest, NextResponse } from "next/server";
import { addCorsHeaders, createErrorResponse, logRequest } from "@/src/middleware-utils";
import { deleteUser, getUser } from "@/src/store";
import { formatUser } from "@/src/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const startTime = Date.now();
  logRequest(request, startTime);

  try {
    const { id } = params;
    const user = getUser(id);
    if (!user) {
      return addCorsHeaders(
        createErrorResponse("User not found", request, 404, "USER_NOT_FOUND"),
      );
    }
    const response = NextResponse.json(formatUser(user));
    return addCorsHeaders(response);
  } catch (error) {
    return addCorsHeaders(
      createErrorResponse(
        "Internal server error",
        request,
        500,
        "INTERNAL_ERROR",
        error instanceof Error ? error.message : "Unknown error",
      ),
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const startTime = Date.now();
  logRequest(request, startTime);

  try {
    const { id } = params;
    const ok = deleteUser(id);
    if (!ok) {
      return addCorsHeaders(
        createErrorResponse("User not found", request, 404, "USER_NOT_FOUND"),
      );
    }
    const response = NextResponse.json({});
    return addCorsHeaders(response);
  } catch (error) {
    return addCorsHeaders(
      createErrorResponse(
        "Internal server error",
        request,
        500,
        "INTERNAL_ERROR",
        error instanceof Error ? error.message : "Unknown error",
      ),
    );
  }
}
