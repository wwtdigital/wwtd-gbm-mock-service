/**
 * OpenAPI specification for the WWTD GBM Mock Service
 */
export const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "WWTD GBM Mock Service API",
    version: "1.0.0",
    description:
      "A mock service for simulating thread-based messaging API endpoints with automatic assistant responses",
    contact: {
      name: "WWTD Team",
    },
  },
  servers: [
    {
      url: "http://localhost:8000",
      description: "Local development server",
    },
  ],
  tags: [
    {
      name: "Health",
      description: "Health check endpoint",
    },
    {
      name: "Threads",
      description: "Thread management endpoints",
    },
    {
      name: "Feedback",
      description: "Feedback management endpoints",
    },
    {
      name: "Mock",
      description: "Mock service configuration and analytics",
    },
  ],
  paths: {
    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        description: "Check if the service is up and running",
        responses: {
          "200": {
            description: "Service is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "ok",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/threads": {
      post: {
        tags: ["Threads"],
        summary: "Create or append to a thread",
        description:
          "Create a new thread or append a message to an existing thread",
        parameters: [
          {
            name: "delayMs",
            in: "query",
            description: "Add artificial delay in milliseconds",
            required: false,
            schema: {
              type: "integer",
              format: "int32",
              minimum: 0,
              maximum: 5000,
            },
          },
          {
            name: "error",
            in: "query",
            description: "Force an error with specified status code",
            required: false,
            schema: {
              type: "integer",
              format: "int32",
              enum: [400, 401, 403, 404, 500],
            },
          },
        ],
        requestBody: {
          description: "Thread request payload",
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ThreadRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Thread created or updated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Thread",
                },
              },
            },
          },
          "400": {
            description: "Invalid request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      get: {
        tags: ["Threads"],
        summary: "List all threads",
        description: "Get a list of all conversation threads",
        responses: {
          "200": {
            description: "List of threads",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Thread",
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/threads/{threadId}": {
      get: {
        tags: ["Threads"],
        summary: "Get thread by ID",
        description: "Get a specific thread by its ID",
        parameters: [
          {
            name: "threadId",
            in: "path",
            description: "Thread ID",
            required: true,
            schema: {
              type: "string",
              format: "uuid",
            },
          },
        ],
        responses: {
          "200": {
            description: "Thread details",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Thread",
                },
              },
            },
          },
          "404": {
            description: "Thread not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/feedback": {
      post: {
        tags: ["Feedback"],
        summary: "Create feedback",
        description: "Create feedback for a specific entry in a thread",
        requestBody: {
          description: "Feedback request payload",
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/FeedbackRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Feedback created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Feedback",
                },
              },
            },
          },
          "400": {
            description: "Invalid request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/feedback/{feedbackId}": {
      get: {
        tags: ["Feedback"],
        summary: "Get feedback by ID",
        description: "Get a specific feedback by its ID",
        parameters: [
          {
            name: "feedbackId",
            in: "path",
            description: "Feedback ID",
            required: true,
            schema: {
              type: "string",
              format: "uuid",
            },
          },
        ],
        responses: {
          "200": {
            description: "Feedback details",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Feedback",
                },
              },
            },
          },
          "404": {
            description: "Feedback not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/entries/{entryId}/feedback": {
      get: {
        tags: ["Feedback"],
        summary: "Get feedback for entry",
        description: "Get all feedback for a specific entry",
        parameters: [
          {
            name: "entryId",
            in: "path",
            description: "Entry ID",
            required: true,
            schema: {
              type: "string",
              format: "uuid",
            },
          },
        ],
        responses: {
          "200": {
            description: "List of feedback for the entry",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Feedback",
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/threads/{threadId}/feedback": {
      get: {
        tags: ["Feedback"],
        summary: "Get feedback for thread",
        description: "Get all feedback for all entries in a thread",
        parameters: [
          {
            name: "threadId",
            in: "path",
            description: "Thread ID",
            required: true,
            schema: {
              type: "string",
              format: "uuid",
            },
          },
        ],
        responses: {
          "200": {
            description: "List of feedback for the thread",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Feedback",
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/threads/{threadId}/feedback/counts": {
      get: {
        tags: ["Feedback"],
        summary: "Get feedback counts for thread",
        description: "Get aggregated thumbs up/down counts for a specific thread",
        parameters: [
          {
            name: "threadId",
            in: "path",
            description: "Thread ID",
            required: true,
            schema: {
              type: "string",
              format: "uuid",
            },
          },
        ],
        responses: {
          "200": {
            description: "Thread feedback counts",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    thread_id: {
                      type: "string",
                      format: "uuid",
                      description: "Thread ID"
                    },
                    thumbs_up: {
                      type: "integer",
                      description: "Number of thumbs up feedback"
                    },
                    thumbs_down: {
                      type: "integer",
                      description: "Number of thumbs down feedback"
                    },
                    total: {
                      type: "integer",
                      description: "Total number of feedback entries"
                    }
                  }
                },
              },
            },
          },
          "404": {
            description: "Thread not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/feedback/counts": {
      get: {
        tags: ["Feedback"],
        summary: "Get global feedback counts",
        description: "Get aggregated thumbs up/down counts across all feedback",
        responses: {
          "200": {
            description: "Global feedback counts",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    thumbs_up: {
                      type: "integer",
                      description: "Number of thumbs up feedback"
                    },
                    thumbs_down: {
                      type: "integer",
                      description: "Number of thumbs down feedback"
                    },
                    total: {
                      type: "integer",
                      description: "Total number of feedback entries"
                    }
                  }
                },
              },
            },
          },
        },
      },
    },
    "/api/mock/config": {
      get: {
        tags: ["Mock"],
        summary: "Get mock service configuration",
        description: "Get the current configuration of the mock service",
        responses: {
          "200": {
            description: "Mock service configuration",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    enableSmartResponses: {
                      type: "boolean",
                    },
                    enableDelayVariation: {
                      type: "boolean",
                    },
                    enableRichContent: {
                      type: "boolean",
                    },
                    mockResponseMode: {
                      type: "string",
                      enum: ["smart", "echo", "random"],
                    },
                    defaultDelayMs: {
                      type: "integer",
                    },
                    maxDelayMs: {
                      type: "integer",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/mock/analytics": {
      get: {
        tags: ["Mock"],
        summary: "Get mock service analytics",
        description: "Get analytics about the mock service usage",
        responses: {
          "200": {
            description: "Mock service analytics",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    totalThreads: {
                      type: "integer",
                    },
                    totalMessages: {
                      type: "integer",
                    },
                    totalFeedback: {
                      type: "integer",
                    },
                    positiveRatings: {
                      type: "integer",
                    },
                    negativeRatings: {
                      type: "integer",
                    },
                  },
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Mock"],
        summary: "Reset mock service analytics",
        description: "Reset all analytics data for the mock service",
        responses: {
          "200": {
            description: "Analytics reset successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Analytics reset successfully",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/mock/scenarios": {
      get: {
        tags: ["Mock"],
        summary: "Get conversation scenarios",
        description: "Get a list of predefined conversation scenarios",
        responses: {
          "200": {
            description: "List of conversation scenarios",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                      },
                      name: {
                        type: "string",
                      },
                      description: {
                        type: "string",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Content: {
        type: "object",
        properties: {
          text: {
            type: "string",
          },
          visual: {
            type: "object",
            additionalProperties: true,
          },
          sources: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
      },
      UniversalMessage: {
        type: "object",
        required: ["role", "content"],
        properties: {
          role: {
            type: "string",
            enum: ["user", "assistant", "system"],
          },
          content: {
            $ref: "#/components/schemas/Content",
          },
        },
      },
      Entry: {
        type: "object",
        required: ["entryId", "threadId", "category", "data", "createdAt"],
        properties: {
          id: {
            type: "integer",
          },
          entryId: {
            type: "string",
            format: "uuid",
          },
          threadId: {
            type: "string",
            format: "uuid",
          },
          category: {
            type: "string",
            enum: ["request", "response"],
          },
          data: {
            $ref: "#/components/schemas/UniversalMessage",
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
        },
      },
      Thread: {
        type: "object",
        required: ["threadId", "userId", "createdAt", "entries"],
        properties: {
          id: {
            type: "integer",
          },
          threadId: {
            type: "string",
            format: "uuid",
          },
          userId: {
            type: "string",
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
          entries: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Entry",
            },
          },
        },
      },
      ThreadRequest: {
        type: "object",
        required: ["userId", "message"],
        properties: {
          threadId: {
            type: "string",
            format: "uuid",
          },
          userId: {
            type: "string",
          },
          message: {
            $ref: "#/components/schemas/UniversalMessage",
          },
        },
      },
      Feedback: {
        type: "object",
        required: [
          "feedbackId",
          "entryId",
          "threadId",
          "userId",
          "rating",
          "createdAt",
        ],
        properties: {
          id: {
            type: "integer",
          },
          feedbackId: {
            type: "string",
            format: "uuid",
          },
          entryId: {
            type: "string",
            format: "uuid",
          },
          threadId: {
            type: "string",
            format: "uuid",
          },
          userId: {
            type: "string",
          },
          rating: {
            type: "string",
            enum: ["thumbs_up", "thumbs_down"],
          },
          comment: {
            type: "string",
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
        },
      },
      FeedbackRequest: {
        type: "object",
        required: ["entryId", "threadId", "userId", "rating"],
        properties: {
          entryId: {
            type: "string",
            format: "uuid",
          },
          threadId: {
            type: "string",
            format: "uuid",
          },
          userId: {
            type: "string",
          },
          rating: {
            type: "string",
            enum: ["thumbs_up", "thumbs_down"],
          },
          comment: {
            type: "string",
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          error: {
            type: "object",
            properties: {
              message: {
                type: "string",
              },
              code: {
                type: "string",
              },
              details: {
                type: "object",
                additionalProperties: true,
              },
            },
          },
        },
      },
    },
  },
};
