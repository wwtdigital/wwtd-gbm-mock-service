import { config } from "./config.js";
import {
  conversationScenarios,
  generateMockResponse,
} from "./mock-responses.js";
import type { UniversalMessage } from "./types.js";

export interface GeneratedResponse {
  content: UniversalMessage["content"];
  delayMs: number;
  mode: string;
}

export function createAssistantResponse(
  userMessage: UniversalMessage,
  threadId: string,
  conversationHistory?: UniversalMessage[],
): GeneratedResponse {
  const userText = userMessage.content.text || "";

  switch (config.mockResponseMode) {
    case "smart":
      return generateSmartResponse(userText, conversationHistory);

    case "echo":
      return generateEchoResponse(userText);

    case "random":
      return generateRandomResponse();

    default:
      return generateSmartResponse(userText, conversationHistory);
  }
}

function generateSmartResponse(
  userText: string,
  conversationHistory?: UniversalMessage[],
): GeneratedResponse {
  // Use the smart response system
  const response = generateMockResponse(userText);

  // Apply configuration flags
  let content = response.content;

  if (!config.enableRichContent) {
    // Strip rich content if disabled
    content = {
      text: content.text,
      visual: {},
      sources: [],
    };
  }

  let delayMs = response.delayMs;
  if (!config.enableDelayVariation) {
    delayMs = config.defaultDelayMs;
  }

  return {
    content,
    delayMs,
    mode: "smart",
  };
}

function generateEchoResponse(userText: string): GeneratedResponse {
  return {
    content: {
      text: `Mock response to: ${userText || "(no text)"}`,
      visual: {},
      sources: [],
    },
    delayMs: config.defaultDelayMs,
    mode: "echo",
  };
}

function generateRandomResponse(): GeneratedResponse {
  const responses = [
    "This is a random mock response for testing purposes.",
    "Here's another simulated response to demonstrate variability.",
    "Random response generation helps test different scenarios.",
    "Mock data provides consistent testing environments.",
    "Simulated responses enable comprehensive API testing.",
  ];

  const randomText = responses[Math.floor(Math.random() * responses.length)];
  const randomDelay = Math.floor(Math.random() * 2000) + 500; // 500-2500ms

  const content: UniversalMessage["content"] = {
    text: randomText,
    visual: {},
    sources: [],
  };

  if (config.enableRichContent && Math.random() > 0.5) {
    // 50% chance of adding rich content
    content.visual = {
      type: "info",
      message: "This is randomly generated rich content",
    };
    content.sources = ["https://example.com/random-source"];
  }

  return {
    content,
    delayMs: config.enableDelayVariation ? randomDelay : config.defaultDelayMs,
    mode: "random",
  };
}

// Scenario-based response generation
export function getScenarioResponse(
  scenarioName: string,
  exchangeIndex: number,
): UniversalMessage["content"] | null {
  const scenario = conversationScenarios.find((s) => s.name === scenarioName);
  if (!scenario || exchangeIndex >= scenario.exchanges.length) {
    return null;
  }

  return scenario.exchanges[exchangeIndex].assistantResponse;
}

// Advanced response features
export function enhanceResponseWithContext(
  baseResponse: UniversalMessage["content"],
  context: {
    userId?: string;
    threadLength?: number;
    previousTopics?: string[];
  },
): UniversalMessage["content"] {
  let enhancedText = baseResponse.text || "";

  // Add contextual elements
  if (context.threadLength && context.threadLength > 1) {
    if (context.threadLength === 2) {
      enhancedText += "\n\nI see this is the start of our conversation.";
    } else if (context.threadLength > 5) {
      enhancedText += "\n\nWe've been having quite a detailed discussion!";
    }
  }

  return {
    ...baseResponse,
    text: enhancedText,
  };
}

// Response analytics for testing
export interface ResponseAnalytics {
  totalResponses: number;
  responsesByMode: Record<string, number>;
  averageDelayMs: number;
  richContentUsage: number;
}

let responseStats: ResponseAnalytics = {
  totalResponses: 0,
  responsesByMode: {},
  averageDelayMs: 0,
  richContentUsage: 0,
};

export function trackResponse(response: GeneratedResponse): void {
  responseStats.totalResponses++;
  responseStats.responsesByMode[response.mode] =
    (responseStats.responsesByMode[response.mode] || 0) + 1;

  // Update running average
  responseStats.averageDelayMs =
    (responseStats.averageDelayMs * (responseStats.totalResponses - 1) +
      response.delayMs) /
    responseStats.totalResponses;

  if (
    response.content.visual &&
    Object.keys(response.content.visual).length > 0
  ) {
    responseStats.richContentUsage++;
  }
}

export function getResponseAnalytics(): ResponseAnalytics {
  return { ...responseStats };
}

export function resetResponseAnalytics(): void {
  responseStats = {
    totalResponses: 0,
    responsesByMode: {},
    averageDelayMs: 0,
    richContentUsage: 0,
  };
}
