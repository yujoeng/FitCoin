# 1. 의존성 설치 스테이지 (deps)
FROM node:18-alpine AS deps
# Alpine 리눅스에서 가끔 발생하는 에러 방지용 패키지임다!
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 사용하는 패키지 매니저(npm, yarn, pnpm)에 맞춰서 lock 파일을 싹 다 가져옴다!
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else npm install; \
  fi

# 2. 빌드 스테이지 (builder)
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 헴의 코드를 싹 다 빌드함다! (이때 standalone 결과물이 나옴다)
RUN npm run build

# 3. 실행 스테이지 (runner) - 진짜 배포될 아주 가벼운 이미지임다!
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# 보안을 위해 root 계정 대신 nextjs 전용 계정을 만듦다!
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 정적 자산(public) 복사
COPY --from=builder /app/public ./public

# 🚨 standalone 모드로 빌드된 핵심 파일들만 쏙쏙 뽑아옴다! (권한도 nextjs로 줌다)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 방금 만든 안전한 계정으로 전환함다!
USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# standalone 모드에서는 next start 대신 server.js를 직접 실행함다!
CMD ["node", "server.js"]