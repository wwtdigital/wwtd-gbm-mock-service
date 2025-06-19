/**
 * Path utilities for consistent imports across the codebase
 *
 * These functions help create consistent import paths while maintaining
 * compatibility with the existing codebase structure.
 */

import path from "node:path";

// Base directories
const SRC_DIR = "../../src";
const APP_DIR = "../../app";
const COMPONENTS_DIR = "../../app/components";

/**
 * Creates a path to a file in the src directory
 * @param filePath - Path relative to the src directory
 * @returns Path with correct extension for importing
 */
export function fromSrc(filePath: string): string {
  // Ensure the path has .js extension for ESM compatibility
  const normalizedPath = filePath.endsWith(".js") ? filePath : `${filePath}.js`;
  return path.posix.join(SRC_DIR, normalizedPath);
}

/**
 * Creates a path to a file in the app directory
 * @param filePath - Path relative to the app directory
 * @returns Path with correct extension for importing
 */
export function fromApp(filePath: string): string {
  // Ensure the path has .js extension for ESM compatibility
  const normalizedPath = filePath.endsWith(".js") ? filePath : `${filePath}.js`;
  return path.posix.join(APP_DIR, normalizedPath);
}

/**
 * Creates a path to a component in the components directory
 * @param filePath - Path relative to the components directory
 * @returns Path with correct extension for importing
 */
export function fromComponents(filePath: string): string {
  // Ensure the path has .js extension for ESM compatibility
  const normalizedPath = filePath.endsWith(".js") ? filePath : `${filePath}.js`;
  return path.posix.join(COMPONENTS_DIR, normalizedPath);
}

/**
 * Usage examples:
 *
 * // Import from src directory
 * import { something } from fromSrc('store');
 *
 * // Import from app directory
 * import { Component } from fromApp('components/ui/button');
 *
 * // Import from components directory
 * import { Card } from fromComponents('ui/card');
 */
