import { ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function Card({ title, children, className = "" }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

interface CardGridProps {
  children: ReactNode;
  columns?: number;
  className?: string;
}

export function CardGrid({ children, columns = 2, className = "" }: CardGridProps) {
  return (
    <div className={`grid md:grid-cols-${columns} gap-8 ${className}`}>
      {children}
    </div>
  );
}

interface EndpointItemProps {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
}

export function EndpointItem({ method, path, description }: EndpointItemProps) {
  const methodColors = {
    GET: "bg-green-100 text-green-800",
    POST: "bg-blue-100 text-blue-800",
    PUT: "bg-amber-100 text-amber-800",
    DELETE: "bg-red-100 text-red-800",
  };

  return (
    <div className="flex items-center">
      <span className={`${methodColors[method]} px-2 py-1 rounded text-sm font-mono mr-3`}>
        {method}
      </span>
      <code className="text-sm">{path}</code>
      <span className="text-gray-500 ml-2">- {description}</span>
    </div>
  );
}

interface FeatureItemProps {
  title: string;
  description: string;
}

export function FeatureItem({ title, description }: FeatureItemProps) {
  return (
    <div className="text-center">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
