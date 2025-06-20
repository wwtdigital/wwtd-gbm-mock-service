/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: true,
  },
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  output: 'standalone',
  
  // Redirect root to API docs
  async redirects() {
    return [
      {
        source: '/',
        destination: '/api-docs',
        permanent: false,
      },
    ];
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options', 
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Environment variable validation
  env: {
    PORT: process.env.PORT,
  },
};

export default nextConfig;