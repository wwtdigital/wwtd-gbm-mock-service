/**
 * Import Patterns Guide
 *
 * This file demonstrates the correct import patterns to use throughout the project.
 * Following these patterns will ensure consistent imports and avoid TypeScript errors.
 *
 * Key patterns:
 *
 * 1. When importing TypeScript files, do NOT use the .js extension in the import path
 *    Next.js handles module resolution automatically, and .js extensions will cause
 *    build failures.
 *
 * 2. Use path aliases where possible to avoid deep relative paths
 *    - @/src/* for src directory imports
 *    - @/app/* for app directory imports
 *    - @/components/* for component imports
 *
 * Examples:
 */

import { createThread } from "@/src/store";
// ✅ Correct: Import from src directory without .js extension
import type { Thread } from "@/src/types";

// ✅ Correct: Import from app components
import { Card } from "@/components/ui/card";

// ❌ Incorrect: Using .js extension
// import { createThread } from "@/src/store.js";

// ❌ Incorrect: Deep relative paths
// import { createThread } from "../../../src/store";

/**
 * Note on Next.js App Router:
 *
 * For server components, you don't need to use the .js extension when importing
 * from the Next.js framework or React:
 */

// ✅ Correct: Framework imports don't need .js extension
import { NextResponse } from "next/server";
import { useState } from "react";

/**
 * This pattern ensures compatibility with Next.js App Router and TypeScript's
 * module resolution strategy in the Next.js build system.
 */
