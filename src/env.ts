import { z } from "zod";

/**
 * Environment variables schema with validation
 */
const envSchema = z.object({
  // Server Configuration
  PORT: z.string().transform(Number).default("8000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  
  // Mock Service Configuration
  DEFAULT_DELAY_MS: z.string().transform(Number).default("0"),
  MAX_DELAY_MS: z.string().transform(Number).default("5000"),
  
  // Mock Response Configuration
  ENABLE_SMART_RESPONSES: z.string().transform((val) => val === "true").default("true"),
  ENABLE_DELAY_VARIATION: z.string().transform((val) => val === "true").default("true"),
  ENABLE_RICH_CONTENT: z.string().transform((val) => val === "true").default("true"),
  MOCK_RESPONSE_MODE: z.enum(["smart", "echo", "random"]).default("smart"),
  
  // Persistence Configuration
  ENABLE_PERSISTENCE: z.string().transform((val) => val === "true").default("false"),
  PERSISTENCE_TYPE: z.enum(["file", "memory"]).default("file"),
  DATA_DIRECTORY: z.string().default("./data"),
  
  // CORS Configuration
  CORS_ENABLED: z.string().transform((val) => val === "true").default("true"),
  CORS_ORIGINS: z.string().default("*"),
  
  // Logging and Rate Limiting
  LOG_LEVEL: z.enum(["none", "basic", "detailed"]).default("basic"),
  RATE_LIMIT_RPM: z.string().transform(Number).default("100"),
});

/**
 * Parse and validate environment variables
 */
function parseEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Invalid environment variables:", JSON.stringify(error.format(), null, 2));
      throw new Error("Invalid environment variables");
    }
    throw error;
  }
}

/**
 * Validated environment variables
 */
export const env = parseEnv();

/**
 * Type definition for environment variables
 */
export type Env = z.infer<typeof envSchema>;
