# 1. 의존성 설치 스테이지
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
# 🚨 컨테이너 안에도 똑같이 Frontend 폴더를 만들어줌다!
WORKDIR /app/Frontend
# 최상단 기준이니까 Frontend/ 경로를 붙여서 가져옴다!
COPY Frontend/package.json Frontend/package-lock.json* Frontend/yarn.lock* ./
RUN npm ci

# 2. 빌드 스테이지
FROM node:18-alpine AS builder
# 🚨 여기가 핵심임다!! 최상단(/app)으로 가서 AI랑 Frontend를 둘 다 챙김다!!
WORKDIR /app
COPY AI ./AI
COPY Frontend ./Frontend

# 챙긴 다음에 다시 Frontend 폴더로 들어가서 빌드 시작!
WORKDIR /app/Frontend
COPY --from=deps /app/Frontend/node_modules ./node_modules
RUN npm run build

# 3. 실행 스테이지
FROM node:18-alpine AS runner
WORKDIR /app/Frontend

ENV NODE_ENV="production"
ENV NEXT_TELEMETRY_DISABLED="1"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 빌드된 결과물들을 싹 다 챙겨옴다!
COPY --from=builder /app/Frontend/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/Frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/Frontend/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT="3000"
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]