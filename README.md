# WWTD GBM Mock Service

A Next.js-based mock service for simulating thread-based messaging API endpoints with intelligent assistant responses. Built with TypeScript, Next.js App Router, and Tailwind CSS.

## Quick Start with Docker

```bash
# Build the Docker image
docker build -t wwtd-gbm-mock-service .

# Run the container
docker run -d -p 8000:8000 --name mock-service wwtd-gbm-mock-service

# Test the service
curl http://localhost:8000/health
```

## Local Development Setup

```bash
# Install dependencies (using pnpm - recommended)
pnpm install

# Or use npm
npm install
```

## Development

```bash
# Start development server with hot reload
pnpm dev

# The service will be available at http://localhost:8000
# Root URL automatically redirects to /api-docs
```

## Production Build

```bash
pnpm build
pnpm start
```

## Testing

```bash
pnpm test
```

## Code Quality

```bash
# Lint code using Biome
pnpm lint

# Format code using Biome  
pnpm format
```

## Architecture

This is a **Next.js 14** application using the **App Router** with the following structure:

### API Routes (`app/api/`)
- `GET /api/health` - Health check endpoint
- `POST /api/threads` - Create new thread or append to existing
- `GET /api/threads` - List all threads
- `GET /api/threads/[id]` - Get specific thread
- `POST /api/feedback` - Submit feedback for entries
- `GET /api/feedback/[id]` - Get feedback by ID
- `GET /api/entries/[entryId]/feedback` - Get feedback for specific entry
- `GET /api/threads/[threadId]/feedback` - Get all feedback for thread

### Mock Management Routes
- `GET /api/mock/config` - View current configuration
- `GET /api/mock/analytics` - Response analytics and metrics
- `DELETE /api/mock/analytics` - Reset analytics data
- `GET /api/mock/scenarios` - List available conversation scenarios
- `GET /api/mock/scenarios/[name]` - Load specific scenario

### Frontend Pages
- `/` - Redirects to API documentation
- `/api-docs` - Interactive API documentation with Tailwind CSS styling
- `/docs` - Additional documentation page

### Core Components

**Store (`src/store.ts`)**
- In-memory thread storage using Map
- Sequential ID generation for threads and entries
- Functions: `createThread`, `appendToThread`, `getThread`, `listThreads`

**Types (`src/types.ts`)**
- Zod schemas for runtime validation
- Core types: `Thread`, `Entry`, `UniversalMessage`, `ThreadRequest`

**Mock Response System (`src/mock-responses.ts`, `src/response-generator.ts`)**
- Intelligent response templates with pattern matching
- Multiple response modes: smart, echo, random
- Rich content support: visual elements, sources, structured data
- Realistic delay simulation with variation

**Middleware (`middleware.ts`)**
- Next.js middleware for request logging and CORS
- Configurable logging levels and error handling
- Security headers and CORS preflight support

## Features

- **Thread-based conversations**: Each thread contains a conversation history with UUIDs
- **Intelligent mock responses**: Pattern-based response generation with multiple modes
- **Rich content support**: Visual elements, sources, and structured data in responses
- **Realistic timing simulation**: Variable delays and response analytics
- **Pre-built scenarios**: Customer support, technical discussions, and more
- **Testing utilities**: Query parameters for `delayMs` and `error` simulation
- **Feedback system**: Thumbs up/down ratings with optional comments
- **Interactive documentation**: Beautiful Tailwind CSS-styled API docs
- **Docker support**: Production-ready containerization
- **TypeScript**: Full type safety with Zod validation
- **Modern tooling**: Biome for linting/formatting, Jest for testing

## API Usage Examples

### Create a new thread
```bash
curl -X POST http://localhost:8000/api/threads \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "message": {
      "role": "user",
      "content": {
        "text": "Hello, how are you?"
      }
    }
  }'
```

### Append to existing thread
```bash
curl -X POST http://localhost:8000/api/threads \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "threadId": "THREAD_UUID_HERE",
    "message": {
      "role": "user", 
      "content": {
        "text": "Follow-up message"
      }
    }
  }'
```

### Test with artificial delay
```bash
curl -X POST "http://localhost:8000/api/threads?delayMs=2000" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test",
    "message": {
      "role": "user",
      "content": {
        "text": "Delayed message"
      }
    }
  }'
```

### Submit feedback
```bash
curl -X POST http://localhost:8000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "entryId": "ENTRY_UUID_HERE",
    "threadId": "THREAD_UUID_HERE",
    "userId": "user123", 
    "rating": "thumbs_up",
    "comment": "Great response!"
  }'
```

## Configuration

### Environment Variables
- `PORT` - Server port (default: 8000)
- `NODE_ENV` - Environment mode (development/production)
- `CORS_ENABLED` - Enable CORS support (default: true)
- `LOG_LEVEL` - Logging level: none, basic, detailed (default: basic)
- `ENABLE_PERSISTENCE` - Enable file-based persistence (default: false)
- `DATA_DIR` - Directory for persistent data storage

### Response Modes
- `smart` - Intelligent pattern-based responses (default)
- `echo` - Simple echo responses for testing
- `random` - Random response selection

### Testing Features
- `?delayMs=1000` - Add artificial delay to responses
- `?error=500` - Force specific HTTP error responses
- Mock analytics and scenario management endpoints

## Docker Configuration

The service uses:
- **Node.js 22 Alpine** base image
- **Port 8000** exposed
- **Production optimizations** enabled
- **Security headers** configured

### Docker Commands
```bash
# Build and run
docker build -t wwtd-gbm-mock-service .
docker run -p 8000:8000 wwtd-gbm-mock-service

# Development with volume mount
docker run -p 8000:8000 -v $(pwd):/app wwtd-gbm-mock-service pnpm dev

# Stop and cleanup
docker stop mock-service
docker rm mock-service
```

## Technology Stack

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Zod** - Runtime type validation
- **Jest** - Testing framework
- **Biome** - Fast linting and formatting
- **Docker** - Containerization
- **pnpm** - Package management (recommended)

## Development Notes

- Uses ES modules (`"type": "module"` in package.json)
- Tailwind CSS with PostCSS processing
- Next.js App Router for modern React patterns
- Server Components for optimal performance
- Automatic redirect from root to API documentation
- Security headers and CORS configuration built-in