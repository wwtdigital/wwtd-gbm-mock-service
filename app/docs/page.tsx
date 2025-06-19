"use client";

import { useEffect } from "react";

export default function DocsPage() {
  useEffect(() => {
    // Load Swagger UI from CDN
    const script = document.createElement("script");
    script.src = "https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js";
    script.onload = () => {
      // @ts-ignore
      SwaggerUIBundle({
        url: "/openapi.json", // Your OpenAPI spec URL
        dom_id: "#swagger-ui",
        presets: [
          // @ts-ignore
          SwaggerUIBundle.presets.apis,
          // @ts-ignore
          SwaggerUIBundle.presets.standalone,
        ],
        layout: "StandaloneLayout",
        deepLinking: true,
        showExtensions: true,
        showCommonExtensions: true,
      });
    };
    document.head.appendChild(script);

    // Load CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css";
    document.head.appendChild(link);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">API Documentation</h1>
        <div id="swagger-ui"></div>
      </div>
    </div>
  );
}