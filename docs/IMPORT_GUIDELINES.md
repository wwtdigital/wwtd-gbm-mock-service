# Import Guidelines for WWTD GBM Mock Service

This document outlines the best practices for managing imports in the WWTD GBM Mock Service project. Following these guidelines will ensure consistent code style and avoid common issues with TypeScript, ESM modules, and testing.

## Current Import Patterns

The project currently uses the following import patterns:

### 1. Relative Imports with `.js` Extensions

Even though we're working with TypeScript files, we use `.js` extensions in our import paths. This is because TypeScript compiles to JavaScript, and the ESM module system expects `.js` extensions at runtime.

```typescript
// ✅ Correct
import { getThread } from "../../../src/store.js";
import { formatThread } from "../../../src/utils.js";
```

### 2. Path Aliases

The project has path aliases configured in `tsconfig.json`:

```json
"paths": {
  "@/*": ["./"],
  "@/src/*": ["./src/*"],
  "@/app/*": ["./app/*"],
  "@/components/*": ["./app/components/*"]
}
```

These can be used in the application code but currently have limitations with Jest tests.

## Best Practices

### For Application Code

1. **Use Relative Imports with `.js` Extensions**

   ```typescript
   // For importing from src directory
   import { something } from "../../../src/module.js";
   
   // For importing from app directory
   import { Component } from "../../components/ui/component.js";
   ```

2. **Organize Imports**

   Group imports in the following order:
   - External libraries (React, Next.js, etc.)
   - Internal modules (project-specific)
   - Types and interfaces
   - CSS/SCSS modules

   ```typescript
   // External libraries
   import { NextRequest, NextResponse } from "next/server";
   import { useState, useEffect } from "react";
   
   // Internal modules
   import { getThread } from "../../../src/store.js";
   import { formatThread } from "../../../src/utils.js";
   
   // Types
   import type { Thread, Entry } from "../../../src/types.js";
   
   // CSS modules (if applicable)
   import styles from "./styles.module.css";
   ```

### For New Features

When adding new features, consider the following:

1. **Keep Imports Consistent**: Follow the existing patterns in the codebase.

2. **Minimize Import Depth**: If you find yourself using many levels of relative imports (`../../../../`), consider restructuring your code or using the utility functions in `src/utils/paths.ts`.

3. **Import Types Explicitly**: Use the `type` keyword when importing only types:

   ```typescript
   import type { Thread, Entry } from "../../../src/types.js";
   ```

## Path Alias Utility

For improved maintainability, you can use the utility functions in `src/utils/paths.ts`:

```typescript
import { fromSrc, fromApp, fromComponents } from "../../utils/paths.js";

// Import from src directory
import { something } from fromSrc("store");

// Import from app directory
import { Component } from fromApp("components/ui/button");

// Import from components directory
import { Card } from fromComponents("ui/card");
```

## Future Improvements

In the future, we may consider:

1. **Enhanced Jest Configuration**: Improving Jest's ability to resolve path aliases consistently with the application code.

2. **ESBuild or SWC**: Migrating to faster build tools that handle path aliases more consistently.

3. **Import Linting**: Adding linting rules to enforce consistent import patterns.

## Troubleshooting Common Issues

### Jest Test Failures with Path Aliases

If you encounter Jest test failures related to imports:

1. Use relative imports in files that are directly tested.
2. Update the Jest configuration in `jest.config.mjs` if needed.

### TypeScript Path Resolution Errors

If TypeScript cannot resolve a path:

1. Ensure you're using the `.js` extension in the import path.
2. Check that the path is correct relative to the importing file.
3. Verify that the module is correctly exported from the source file.
