# 1. 의존성 설치 스테이지
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
# 🚨 컨테이너 안에도 똑같이 Frontend/fitCoin 폴더를 만들어줌다!
WORKDIR /app/Frontend/fitCoin
# 최상단 기준이니까 Frontend/fitCoin/ 경로를 붙여서 가져옴다!
COPY Frontend/fitCoin/package.json Frontend/fitCoin/package-lock.json* Frontend/fitCoin/yarn.lock* ./
RUN npm ci

# 2. 빌드 스테이지
FROM node:18-alpine AS builder
# 🚨 여기가 핵심임다!! 최상단(/app)으로 가서 AI랑 Frontend/fitCoin를 둘 다 챙김다!!
WORKDIR /app
COPY AI ./AI
COPY Frontend/fitCoin ./Frontend/fitCoin

# 챙긴 다음에 다시 Frontend/fitCoin 폴더로 들어가서 빌드 시작!
WORKDIR /app/Frontend/fitCoin
COPY --from=deps /app/Frontend/fitCoin/node_modules ./node_modules
RUN npm run build

# 3. 실행 스테이지
FROM node:18-alpine AS runner
WORKDIR /app/Frontend/fitCoin

ENV NODE_ENV="production"
ENV NEXT_TELEMETRY_DISABLED="1"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 빌드된 결과물들을 싹 다 챙겨옴다!
COPY --from=builder /app/Frontend/fitCoin/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/Frontend/fitCoin/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/Frontend/fitCoin/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT="3000"
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]