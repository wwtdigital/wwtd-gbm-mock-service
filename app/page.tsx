import { Header } from "./components/header";
import { Card, CardGrid, EndpointItem, FeatureItem } from "./components/ui/card";
import { ConfigSection } from "./components/config-section";

// Core API endpoints data
const coreEndpoints = [
  { method: "GET" as const, path: "/api/health", description: "Health check" },
  { method: "POST" as const, path: "/api/threads", description: "Create/append thread" },
  { method: "GET" as const, path: "/api/threads", description: "List all threads" },
  { method: "GET" as const, path: "/api/threads/[id]", description: "Get specific thread" },
  { method: "POST" as const, path: "/api/feedback", description: "Submit feedback" },
];

// Mock response features data
const mockEndpoints = [
  { method: "GET" as const, path: "/api/mock/config", description: "View configuration" },
  { method: "GET" as const, path: "/api/mock/analytics", description: "Response analytics" },
  { method: "GET" as const, path: "/api/mock/scenarios", description: "List conversation scenarios" },
  { method: "DELETE" as const, path: "/api/mock/analytics", description: "Reset analytics" },
];

// Intelligent mock response features
const features = [
  {
    title: "Smart Pattern Matching",
    description: "Responses vary based on input patterns like greetings, questions, code requests, etc.",
  },
  {
    title: "Rich Content Support",
    description: "Includes visual elements, source references, and structured data in responses.",
  },
  {
    title: "Realistic Timing",
    description: "Variable response delays to simulate real AI processing time.",
  },
];

// Configuration options
const responseModes = [
  { code: "smart", description: "Intelligent pattern-based responses" },
  { code: "echo", description: "Simple echo responses" },
  { code: "random", description: "Random response selection" },
];

const testingFeatures = [
  { code: "?delayMs=1000", description: "Artificial delay simulation" },
  { code: "?error=500", description: "Forced errors" },
  { code: "CORS_ENABLED=true", description: "Configurable CORS and logging" },
  { code: "ENABLE_PERSISTENCE=true", description: "Optional file-based persistence" },
];

/**
 * Home page component - Server Component
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Header 
          title="WWTD GBM Mock Service" 
          description="Advanced thread-based messaging API with intelligent mock responses" 
        />

        <CardGrid className="mb-12">
          <Card title="Core API Endpoints">
            <div className="space-y-3">
              {coreEndpoints.map((endpoint, index) => (
                <EndpointItem 
                  key={index} 
                  method={endpoint.method} 
                  path={endpoint.path} 
                  description={endpoint.description} 
                />
              ))}
            </div>
          </Card>

          <Card title="Mock Response Features">
            <div className="space-y-3">
              {mockEndpoints.map((endpoint, index) => (
                <EndpointItem 
                  key={index} 
                  method={endpoint.method} 
                  path={endpoint.path} 
                  description={endpoint.description} 
                />
              ))}
            </div>
          </Card>
        </CardGrid>

        <Card title="Intelligent Mock Responses" className="mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureItem 
                key={index} 
                title={feature.title} 
                description={feature.description} 
              />
            ))}
          </div>
        </Card>

        <Card title="Configuration Options">
          <div className="grid md:grid-cols-2 gap-6">
            <ConfigSection title="Response Modes" items={responseModes} />
            <ConfigSection title="Testing Features" items={testingFeatures} />
          </div>
        </Card>
      </div>
    </div>
  );
}