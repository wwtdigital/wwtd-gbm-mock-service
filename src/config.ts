import { env } from "./env";

/**
 * Application configuration derived from validated environment variables
 */
export const config = {
  port: env.PORT,
  nodeEnv: env.NODE_ENV,

  // Mock service settings
  defaultDelayMs: env.DEFAULT_DELAY_MS,
  maxDelayMs: env.MAX_DELAY_MS,

  // Mock response settings
  enableSmartResponses: env.ENABLE_SMART_RESPONSES,
  enableDelayVariation: env.ENABLE_DELAY_VARIATION,
  enableRichContent: env.ENABLE_RICH_CONTENT,
  mockResponseMode: env.MOCK_RESPONSE_MODE,

  // Persistence settings
  enablePersistence: env.ENABLE_PERSISTENCE,
  persistenceType: env.PERSISTENCE_TYPE,
  dataDirectory: env.DATA_DIRECTORY,

  // CORS settings
  corsEnabled: env.CORS_ENABLED,
  corsOrigins: env.CORS_ORIGINS.split(","),

  // Logging
  logLevel: env.LOG_LEVEL,

  // Rate limiting
  rateLimitRpm: env.RATE_LIMIT_RPM,

  // Feature flags
  isDevelopment: env.NODE_ENV === "development",
  isProduction: env.NODE_ENV === "production",
} as const;

/**
 * Type definition for the application configuration
 */
export type Config = typeof config;
