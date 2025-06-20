import { NextRequest, NextResponse } from "next/server";
import {
  addCorsHeaders,
  checkForceError,
  createErrorResponse,
  handleDelay,
  logRequest,
} from "@/src/middleware-utils";
import { UserSchema, type User } from "@/src/types";
import {
  createUser,
  listUsers,
} from "@/src/store";
import { formatUser } from "@/src/utils";

const CreateUserSchema = UserSchema.omit({ id: true });

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  logRequest(request, startTime);

  try {
    const users = listUsers().map(formatUser);
    const response = NextResponse.json(users);
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

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  logRequest(request, startTime);

  // forced error, delay
  const forced = checkForceError(request);
  if (forced) return addCorsHeaders(forced);
  await handleDelay(request);

  try {
    const body = await request.json();
    const parse = CreateUserSchema.safeParse(body);
    if (!parse.success) {
      return addCorsHeaders(
        createErrorResponse(
          "Invalid request body",
          request,
          400,
          "VALIDATION_ERROR",
          JSON.stringify(parse.error.format()),
        ),
      );
    }

    const created = createUser(parse.data as Omit<User, "id">);
    const response = NextResponse.json(formatUser(created));
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
