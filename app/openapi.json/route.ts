import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const openApiPath = path.join(process.cwd(), "openapi.json");
    const openApiContent = fs.readFileSync(openApiPath, "utf8");
    const openApiSpec = JSON.parse(openApiContent);
    
    return NextResponse.json(openApiSpec);
  } catch (error) {
    console.error("Error loading OpenAPI spec:", error);
    return NextResponse.json(
      { error: "Failed to load OpenAPI specification" },
      { status: 500 }
    );
  }
}