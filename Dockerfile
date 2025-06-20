# Use Node.js 22 Alpine for smaller image size
FROM node:22-alpine

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files (no package-lock.json, using pnpm)
COPY package.json pnpm-lock.yaml* ./

# Install all dependencies (including dev dependencies for build)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the Next.js application
RUN pnpm build

# Remove dev dependencies to reduce image size
RUN pnpm prune --prod

# Expose port 8000
EXPOSE 8000

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8000

# Start the Next.js application
CMD ["pnpm", "start"]