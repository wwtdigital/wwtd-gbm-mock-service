import { NextResponse } from "next/server";
import { openApiSpec } from "@/src/openapi";

export async function GET() {
  try {
    return NextResponse.json(openApiSpec, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error loading OpenAPI spec:", error);
    return NextResponse.json(
      { error: "Failed to load OpenAPI specification" },
      { status: 500 }
    );
  }
}