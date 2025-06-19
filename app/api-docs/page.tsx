import { openApiSpec } from "@/src/openapi";

/**
 * API Documentation page
 * This is a server component for better performance
 */
export default function ApiDocs() {
  const { paths, components } = openApiSpec;
  const pathEntries = Object.entries(paths);
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">API Documentation</h1>
          <p className="text-gray-600">
            Documentation for the WWTD GBM Mock Service API
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">API Overview</h2>
          <p className="mb-4">
            {openApiSpec.info.description}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Base URL</h3>
              <code className="bg-gray-100 px-2 py-1 rounded text-sm block">
                {openApiSpec.servers[0].url}
              </code>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Version</h3>
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                {openApiSpec.info.version}
              </code>
            </div>
          </div>
        </div>
        
        {/* Group endpoints by tag */}
        {openApiSpec.tags.map((tag) => {
          const tagEndpoints = pathEntries.filter(([path, methods]) => {
            return Object.values(methods).some(
              (method) => method.tags && method.tags.includes(tag.name)
            );
          });
          
          if (tagEndpoints.length === 0) return null;
          
          return (
            <div key={tag.name} className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-2">{tag.name}</h2>
              <p className="text-gray-600 mb-6">{tag.description}</p>
              
              <div className="space-y-8">
                {tagEndpoints.map(([path, methods]) => {
                  return Object.entries(methods).map(([method, details]) => {
                    if (!details.tags || !details.tags.includes(tag.name)) return null;
                    
                    const methodColors = {
                      get: "bg-green-100 text-green-800 border-green-200",
                      post: "bg-blue-100 text-blue-800 border-blue-200",
                      put: "bg-amber-100 text-amber-800 border-amber-200",
                      delete: "bg-red-100 text-red-800 border-red-200",
                    };
                    
                    const colorClass = methodColors[method] || "bg-gray-100 text-gray-800 border-gray-200";
                    
                    return (
                      <div key={`${path}-${method}`} className={`border-l-4 ${colorClass} pl-4 py-1`}>
                        <div className="flex items-center mb-2">
                          <span className={`${colorClass} px-2 py-1 rounded text-sm font-mono uppercase mr-3`}>
                            {method}
                          </span>
                          <code className="text-sm font-semibold">{path}</code>
                        </div>
                        
                        <p className="text-gray-700 mb-4">{details.description}</p>
                        
                        {details.parameters && details.parameters.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-semibold text-sm mb-2">Parameters</h4>
                            <div className="bg-gray-50 p-3 rounded">
                              <table className="min-w-full text-sm">
                                <thead>
                                  <tr className="border-b">
                                    <th className="text-left py-2">Name</th>
                                    <th className="text-left py-2">In</th>
                                    <th className="text-left py-2">Required</th>
                                    <th className="text-left py-2">Description</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {details.parameters.map((param, i) => (
                                    <tr key={i} className="border-b border-gray-200">
                                      <td className="py-2 font-mono">{param.name}</td>
                                      <td className="py-2">{param.in}</td>
                                      <td className="py-2">{param.required ? "Yes" : "No"}</td>
                                      <td className="py-2">{param.description}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                        
                        {details.requestBody && (
                          <div className="mb-4">
                            <h4 className="font-semibold text-sm mb-2">Request Body</h4>
                            <div className="bg-gray-50 p-3 rounded">
                              <p className="mb-2">{details.requestBody.description}</p>
                              <p className="text-xs">Content Type: <code>application/json</code></p>
                              {details.requestBody.content && details.requestBody.content["application/json"] && (
                                <p className="text-xs mt-1">
                                  Schema: <code>{details.requestBody.content["application/json"].schema.$ref?.split("/").pop()}</code>
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <h4 className="font-semibold text-sm mb-2">Responses</h4>
                        <div className="bg-gray-50 p-3 rounded">
                          <table className="min-w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2">Status</th>
                                <th className="text-left py-2">Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(details.responses).map(([status, response]) => (
                                <tr key={status} className="border-b border-gray-200">
                                  <td className="py-2 font-mono">{status}</td>
                                  <td className="py-2">{response.description}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  }).filter(Boolean);
                })}
              </div>
            </div>
          );
        })}
        
        {/* Schemas section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Schemas</h2>
          <div className="space-y-6">
            {Object.entries(components.schemas).map(([name, schema]) => (
              <div key={name} className="border-t pt-4">
                <h3 className="font-semibold mb-2">{name}</h3>
                <p className="text-sm text-gray-600 mb-2">Type: {schema.type}</p>
                
                {schema.properties && (
                  <div className="bg-gray-50 p-3 rounded">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Property</th>
                          <th className="text-left py-2">Type</th>
                          <th className="text-left py-2">Required</th>
                          <th className="text-left py-2">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(schema.properties).map(([propName, prop]) => {
                          const isRequired = schema.required?.includes(propName) || false;
                          return (
                            <tr key={propName} className="border-b border-gray-200">
                              <td className="py-2 font-mono">{propName}</td>
                              <td className="py-2">
                                {prop.$ref ? prop.$ref.split("/").pop() : prop.type}
                                {prop.enum && ` (${prop.enum.join(', ')})`}
                              </td>
                              <td className="py-2">{isRequired ? "Yes" : "No"}</td>
                              <td className="py-2">{prop.description || ""}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
