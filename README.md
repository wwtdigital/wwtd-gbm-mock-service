# WWTD GBM Mock Service

A mock service for simulating thread-based messaging API endpoints.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

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
    "message": "string",
    "threadId": "string (optional)"
  }
  ```
- Creates new thread if no `threadId`, appends to existing if `threadId` provided

### Get Thread
- **GET** `/threads/:id`
- Returns thread data or 404 if not found

## Environment Variables

- `PORT`: Server port (default: 3000)