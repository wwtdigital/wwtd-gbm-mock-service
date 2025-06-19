import type { UniversalMessage } from "./types";

export interface MockResponseTemplate {
  patterns: string[];
  responses: UniversalMessage["content"][];
  weight?: number;
  delayMs?: number;
}

export interface ConversationScenario {
  name: string;
  description: string;
  exchanges: Array<{
    userInput: string;
    assistantResponse: UniversalMessage["content"];
  }>;
}

// Default response templates
export const mockResponseTemplates: MockResponseTemplate[] = [
  // Greeting patterns
  {
    patterns: ["hello", "hi", "hey", "greetings"],
    responses: [
      {
        text: "Hello! I'm a mock assistant. How can I help you today?",
        visual: {},
        sources: [],
      },
      {
        text: "Hi there! I'm here to assist you. What would you like to know?",
        visual: {},
        sources: [],
      },
      {
        text: "Greetings! I'm a simulated AI assistant ready to help.",
        visual: {},
        sources: [],
      },
    ],
    weight: 2,
    delayMs: 500,
  },

  // Question patterns
  {
    patterns: ["what", "how", "why", "when", "where", "?"],
    responses: [
      {
        text: "That's an interesting question! As a mock assistant, I can provide simulated responses to help with testing and development.",
        visual: {},
        sources: ["https://example.com/mock-source"],
      },
      {
        text: "I'd be happy to help with that inquiry. In a real system, I would analyze your question and provide detailed information.",
        visual: {},
        sources: [],
      },
      {
        text: "Great question! Let me provide you with a comprehensive mock response that demonstrates various content types.",
        visual: {
          type: "chart",
          data: { example: "mock data" },
        },
        sources: ["https://example.com/documentation"],
      },
    ],
    weight: 3,
    delayMs: 1200,
  },

  // Code-related patterns
  {
    patterns: ["code", "function", "api", "programming", "debug", "error"],
    responses: [
      {
        text: "Here's a mock code example:\n\n```javascript\nfunction mockExample() {\n  return 'This is simulated code';\n}\n```\n\nThis demonstrates how code responses might be formatted.",
        visual: {},
        sources: ["https://developer.example.com/docs"],
      },
      {
        text: "For programming questions, I would typically analyze the code context and provide specific guidance. This is a simulated response for testing purposes.",
        visual: {
          type: "code_block",
          language: "javascript",
          content: "// Mock code snippet\nconsole.log('Hello, mock world!');",
        },
        sources: [],
      },
    ],
    weight: 2,
    delayMs: 800,
  },

  // Help/assistance patterns
  {
    patterns: ["help", "assist", "support", "guide"],
    responses: [
      {
        text: "I'm here to help! As a mock assistant, I can simulate various types of responses including text, structured data, and source references.",
        visual: {},
        sources: [],
      },
      {
        text: "I'd be glad to assist you. Here are some things I can help simulate:\n\n• Answering questions\n• Providing code examples\n• Explaining concepts\n• Troubleshooting issues",
        visual: {
          type: "list",
          items: ["Mock assistance", "Simulated responses", "Test scenarios"],
        },
        sources: ["https://help.example.com"],
      },
    ],
    weight: 2,
    delayMs: 600,
  },

  // Thanks/positive patterns
  {
    patterns: ["thank", "thanks", "appreciate", "great", "awesome", "perfect"],
    responses: [
      {
        text: "You're welcome! I'm glad I could help with your testing needs.",
        visual: {},
        sources: [],
      },
      {
        text: "Happy to assist! This mock service is designed to provide realistic response patterns for development and testing.",
        visual: {},
        sources: [],
      },
    ],
    weight: 1,
    delayMs: 400,
  },

  // Default fallback
  {
    patterns: [""],
    responses: [
      {
        text: "I understand you're looking for information. As a mock assistant, I'm designed to provide simulated responses for testing purposes.",
        visual: {},
        sources: [],
      },
      {
        text: "This is a mock response generated based on your input. In a real system, I would provide more specific and helpful information.",
        visual: {},
        sources: [],
      },
      {
        text: "Thank you for your message. I'm simulating how an AI assistant might respond to help with development and testing scenarios.",
        visual: {
          type: "info",
          message: "This is a simulated response",
        },
        sources: [],
      },
    ],
    weight: 1,
    delayMs: 1000,
  },
];

// Pre-built conversation scenarios for testing
export const conversationScenarios: ConversationScenario[] = [
  {
    name: "customer_support",
    description: "A typical customer support conversation flow",
    exchanges: [
      {
        userInput: "I'm having trouble with my account",
        assistantResponse: {
          text: "I'm sorry to hear you're experiencing account issues. I'd be happy to help you resolve this. Can you please tell me more about the specific problem you're encountering?",
          visual: {},
          sources: [],
        },
      },
      {
        userInput: "I can't log in to my dashboard",
        assistantResponse: {
          text: "I understand you're having trouble logging into your dashboard. Let me guide you through some troubleshooting steps:\n\n1. Verify your email and password\n2. Clear your browser cache\n3. Try using an incognito window\n\nHave you tried any of these steps already?",
          visual: {
            type: "troubleshooting_steps",
            steps: ["Verify credentials", "Clear cache", "Try incognito mode"],
          },
          sources: ["https://support.example.com/login-issues"],
        },
      },
    ],
  },
  {
    name: "technical_discussion",
    description: "A technical discussion about APIs and development",
    exchanges: [
      {
        userInput: "How do I implement rate limiting in my API?",
        assistantResponse: {
          text: "Rate limiting is crucial for API stability. Here are the main approaches:\n\n**Token Bucket**: Allows bursts but controls long-term rate\n**Fixed Window**: Simple but can allow bursts at window boundaries\n**Sliding Window**: More accurate but complex to implement\n\nWhich approach fits your use case best?",
          visual: {
            type: "comparison_table",
            data: {
              "Token Bucket": "Flexible, allows bursts",
              "Fixed Window": "Simple, predictable",
              "Sliding Window": "Accurate, complex",
            },
          },
          sources: [
            "https://example.com/rate-limiting-guide",
            "https://developer.example.com/api-best-practices",
          ],
        },
      },
    ],
  },
];

// Response generation utilities
export function findMatchingTemplate(input: string): MockResponseTemplate {
  const lowerInput = input.toLowerCase();

  // Find templates with matching patterns
  const candidates = mockResponseTemplates.filter((template) =>
    template.patterns.some(
      (pattern) => pattern === "" || lowerInput.includes(pattern.toLowerCase()),
    ),
  );

  // Weight-based selection
  const totalWeight = candidates.reduce(
    (sum, template) => sum + (template.weight || 1),
    0,
  );
  let random = Math.random() * totalWeight;

  for (const template of candidates) {
    random -= template.weight || 1;
    if (random <= 0) {
      return template;
    }
  }

  // Fallback to last template (default)
  const fallbackTemplate =
    mockResponseTemplates[mockResponseTemplates.length - 1];
  if (!fallbackTemplate) {
    throw new Error("No response templates available");
  }
  return fallbackTemplate;
}

export function generateMockResponse(input: string): {
  content: UniversalMessage["content"];
  delayMs: number;
} {
  const template = findMatchingTemplate(input);
  const responses = template.responses;
  const selectedResponse =
    responses[Math.floor(Math.random() * responses.length)];
  if (!selectedResponse) {
    throw new Error("No responses available in template");
  }

  // Add some variation to delay
  const baseDelay = template.delayMs || 1000;
  const variationMs = Math.random() * 500; // ±250ms variation
  const delayMs = Math.floor(baseDelay + variationMs - 250);

  return {
    content: selectedResponse,
    delayMs: Math.max(100, delayMs), // Minimum 100ms delay
  };
}
