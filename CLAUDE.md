# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Development
- `npm run dev` - Start Next.js development server with hot reload
- `npm run build` - Build Next.js application for production
- `npm start` - Start Next.js production server

### Testing
- `npm test` - Run Jest tests
- Test files are located in `tests/` directory with `.test.ts` extension
- Both original Express tests (`api.test.ts`) and Next.js API route tests (`next-api.test.ts`) are available

### Code Quality
- `npm run lint` - Lint code using Biome
- `npm run format` - Format code using Biome
- Always run lint after making changes to ensure code quality

## Architecture Overview

This is a Next.js-based mock service that simulates thread-based messaging API endpoints, designed to mimic conversational AI systems.

### Core Components

**Store (`src/store.ts`)**
- In-memory thread storage using Map
- Sequential ID generation for threads and entries
- Functions: `createThread`, `appendToThread`, `getThread`, `listThreads`

**Types (`src/types.ts`)**
- Zod schemas for runtime validation
- Core types: `Thread`, `Entry`, `UniversalMessage`, `ThreadRequest`
- Thread contains multiple entries (request/response pairs)

**Next.js API Routes (`app/api/`)**
- Next.js App Router API routes replacing Express.js
- Intelligent mock assistant responses with pattern matching
- Supports artificial delays and forced errors via query parameters
- Enhanced with middleware for CORS, logging, and error handling
- Core endpoints: `/api/health`, `POST /api/threads`, `GET /api/threads`, `GET /api/threads/[id]`
- Mock management: `/api/mock/config`, `/api/mock/analytics`, `/api/mock/scenarios`

**Middleware (`src/middleware.ts` & `middleware.ts`)**
- Request logging with configurable levels
- CORS handling with preflight support
- Consistent error response formatting
- Delay simulation and forced error testing

**Mock Response System (`src/mock-responses.ts`, `src/response-generator.ts`)**
- Intelligent response templates with pattern matching
- Multiple response modes: smart, echo, random
- Rich content support: visual elements, sources, structured data
- Realistic delay simulation with variation
- Pre-built conversation scenarios for testing
- Response analytics and tracking

**Utilities (`src/utils.ts`)**
- `formatThread` - Converts internal thread format to API response format (camelCase to snake_case)

**Persistence Layer (`src/persistence.ts`)**
- Optional file-based or memory persistence
- Configurable data storage directory
- Thread and feedback persistence support

### Key Features

- **Thread-based messaging**: Each thread contains a conversation history
- **Intelligent mock responses**: Pattern-based response generation with multiple modes
- **Rich content support**: Visual elements, sources, and structured data in responses
- **Realistic timing simulation**: Variable delays and response analytics
- **Pre-built scenarios**: Customer support, technical discussions, and more
- **Testing utilities**: Query parameters for `delayMs` and `error` to simulate different conditions
- **Validation**: Uses Zod for request/response validation
- **UUID support**: UUIDs for threadId and entryId, sequential numbers for id fields
- **Environment configuration**: Configurable via environment variables (.env support)
- **CORS support**: Configurable CORS headers for cross-origin requests
- **Request logging**: Configurable request logging (none, basic, detailed)
- **Error handling**: Consistent error response format with error codes
- **Security headers**: Production-ready security headers
- **Optional persistence**: File-based storage for threads and feedback

## Docker

### Build and Run
```bash
# Build the Docker image
docker build -t wwtd-gbm-mock-service .

# Run the container on port 8000
docker run -p 8000:8000 wwtd-gbm-mock-service

# Run in detached mode
docker run -d -p 8000:8000 --name mock-service wwtd-gbm-mock-service

# Stop the container
docker stop mock-service

# Remove the container
docker rm mock-service
```

### Docker Configuration
- Uses Node.js 22 Alpine base image
- Exposes port 8000
- Runs `npm start` to serve the built Next.js application
- Sets NODE_ENV=production, NEXT_TELEMETRY_DISABLED=1, and PORT=8000

## Configuration

- Next.js App Router with TypeScript
- Uses ES modules (`"type": "module"` in package.json)
- Biome for linting/formatting (replaces ESLint/Prettier)
- Jest with ts-jest for testing
- Default port: 8000 (configured for compatibility)
- Docker exposes port 8000