# Install dependencies only when needed
FROM node:20.10 AS deps

WORKDIR /app
COPY package.json ./
RUN yarn set version v1.22.19
RUN yarn install --silent

# Rebuild the source code only when needed
FROM node:20.10 AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN yarn set version v1.22.19
RUN yarn build

# Production image, copy all the files and run next
FROM node:20.10 AS runner
WORKDIR /app
ENV NODE_ENV production

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY entrypoint.sh .
COPY .env .
# Execute script
RUN yarn set version v1.22.19
RUN ["chmod", "+x", "./entrypoint.sh"]
ENTRYPOINT ["./entrypoint.sh"]
ENV NEXT_TELEMETRY_DISABLED 1

ARG PORT
ENV PORT=${PORT:-9094}
ENV NODE_ENV "production"
EXPOSE $PORT
CMD ["sh", "-c", "yarn serve -p ${PORT}"]