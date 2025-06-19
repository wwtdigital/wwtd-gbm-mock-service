# WWTD GBM Mock Service

A mock service for simulating thread-based messaging API endpoints with automatic assistant responses. Built with TypeScript, Express, and Docker support.

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
npm install
```

## Development

```bash
# Start development server with hot reload
npm run dev

# Or specify a custom port
PORT=8000 npm run dev
```

## Production Build

```bash
npm run build
npm start
```

## Testing

```bash
npm test
```

## Linting & Formatting

```bash
npm run lint
npm run format
```

## API Endpoints

### Health Check
- **GET** `/health`
- Returns: `{ "status": "ok" }`

### Create/Append Thread
- **POST** `/threads`
- Query params:
  - `delayMs`: Add artificial delay (optional)
  - `error`: Force error with status code (optional)
- Body:
  ```json
  {
    "userId": "string",
    "message": {
      "role": "user",
      "content": {
        "text": "Your message here"
      }
    },
    "threadId": "string (optional)"
  }
  ```
- Creates new thread if no `threadId`, appends to existing if `threadId` provided

### List All Threads
- **GET** `/threads`
- Returns array of all threads

### Get Thread by ID
- **GET** `/threads/:id`
- Returns thread data or 404 if not found

## Features

- **Thread-based conversations**: Create and manage conversation threads
- **Auto-generated responses**: Automatically generates mock assistant replies
- **Testing utilities**: Query parameters for delays and forced errors
- **Docker support**: Production-ready containerization
- **TypeScript**: Full type safety with Zod validation
- **Modern tooling**: Biome for linting/formatting, Jest for testing

## Environment Variables

- `PORT`: Server port (default: 3000, Docker default: 8000)
- `NODE_ENV`: Environment mode (development/production)

## Docker Commands

```bash
# Build image
docker build -t wwtd-gbm-mock-service .

# Run container
docker run -d -p 8000:8000 --name mock-service wwtd-gbm-mock-service

# Stop container
docker stop mock-service

# Remove container
docker rm mock-service
```

## Example Usage

```bash
# Create a new thread
curl -X POST http://localhost:8000/threads \
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

# List all threads
curl http://localhost:8000/threads

# Test with artificial delay
curl -X POST "http://localhost:8000/threads?delayMs=2000" \
  -H "Content-Type: application/json" \
  -d '{"userId": "test", "message": {"role": "user", "content": {"text": "Delayed message"}}}'
```