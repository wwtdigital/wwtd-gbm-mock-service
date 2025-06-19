# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Development
- `npm run dev` - Start development server with hot reload using tsx
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run built application from dist/

### Testing
- `npm test` - Run Jest tests
- Test files are located in `tests/` directory with `.test.ts` extension

### Code Quality
- `npm run lint` - Lint code using Biome
- `npm run format` - Format code using Biome
- Always run lint after making changes to ensure code quality

## Architecture Overview

This is a mock service that simulates thread-based messaging API endpoints, designed to mimic conversational AI systems.

### Core Components

**Store (`src/store.ts`)**
- In-memory thread storage using Map
- Sequential ID generation for threads and entries
- Functions: `createThread`, `appendToThread`, `getThread`, `listThreads`

**Types (`src/types.ts`)**
- Zod schemas for runtime validation
- Core types: `Thread`, `Entry`, `UniversalMessage`, `ThreadRequest`
- Thread contains multiple entries (request/response pairs)

**API Server (`src/index.ts`)**
- Express.js server with JSON middleware
- Auto-generates mock assistant responses for every user message
- Supports artificial delays and forced errors via query parameters
- Endpoints: `/health`, `POST /threads`, `GET /threads`, `GET /threads/:id`

**Utilities (`src/utils.ts`)**
- `formatThread` - Converts internal thread format to API response format (camelCase to snake_case)

### Key Features

- **Thread-based messaging**: Each thread contains a conversation history
- **Auto-responses**: Automatically generates mock assistant replies to user messages
- **Testing utilities**: Query parameters for `delayMs` and `error` to simulate different conditions
- **Validation**: Uses Zod for request/response validation
- **UUID support**: UUIDs for threadId and entryId, sequential numbers for id fields

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
- Exposes port 8000 by default
- Runs `npm start` to serve the built application
- Sets NODE_ENV=production

## Configuration

- Uses ES modules (`"type": "module"` in package.json)
- TypeScript with ESM support
- Biome for linting/formatting (replaces ESLint/Prettier)
- Jest with ts-jest for testing
- Default port: 3000 (configurable via PORT environment variable)
- Docker default port: 8000