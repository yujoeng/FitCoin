# FitCoin 프로젝트 문서

---

## 1. Gitlab 소스 클론 이후 빌드 및 배포할 수 있도록 정리한 문서

### 1) 사용한 JVM, 웹서버, WAS 제품 등의 종류와 설정 값, 버전

| 항목 | 제품 | 버전 |
|---|---|---|
| Language | Java | 21 |
| Framework | Spring Boot | 3.5.11 |
| Build Tool | Gradle | - |
| WAS | Spring Embedded Tomcat | - |
| Web Server | Nginx | latest (Docker) |
| Database | MySQL | 8.0 (Docker) |
| Cache | Redis | alpine (Docker) |
| Object Storage | MinIO | latest (Docker) |
| CI/CD | Jenkins | 2.541.2 |
| Container | Docker | 29.3.0 |
| OS | Ubuntu (EC2) | 24.04.3 LTS |
| Frontend Runtime | Node.js | 24.13.0 |
| Frontend Framework | Next.js | 14.2.3 |

> `build.gradle`의 `springBootVersion`, `package.json`의 `next` 버전으로 확인 가능합니다.

---

### 2) 빌드 시 사용되는 환경 변수 등의 내용 상세 기재

#### 백엔드 배포 환경변수 (`Backend/fitCoin/.env`)

```env
# Server
SERVER_PORT=8080
TZ=Asia/Seoul

# Database
DATABASE_HOST=mysql
DATABASE_PORT=3306
DATABASE_NAME=a504
DATABASE_USERNAME=a504
DATABASE_PASSWORD=a504a504@
MYSQL_ROOT_PASSWORD=a504a504@

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=a504a504@

# Mail
MAIL_USERNAME=ssafykim1122@gmail.com
MAIL_PASSWORD=qovmhhskozvmifti

# JWT
JWT_SECRET=jwt-secret-ddazzi-fitcoin-hanhyunjin
JWT_ACCESS_TOKEN_VALIDITY=3600000
JWT_REFRESH_TOKEN_VALIDITY=1209600000

# CORS
CORS_ORIGIN_LOCAL_VITE=http://localhost:5173
CORS_ORIGIN_LOCAL_REACT=http://localhost:3000

# PASSWORD
PASSWORD_RESET_URL=https://j14a504.p.ssafy.io/password-reset

# Minio
MINIO_ROOT_USER=a504
MINIO_ROOT_PASSWORD=a504a504@

```

#### 백엔드 로컬 환경변수 (`Backend/fitCoin/.env`)

```env
# Server
SERVER_PORT=8080
TZ=Asia/Seoul

# Database
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=a504
DATABASE_USERNAME=a504
DATABASE_PASSWORD=a504a504@
MYSQL_ROOT_PASSWORD=a504a504@

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=a504a504@

# Mail
MAIL_USERNAME=ssafykim1122@gmail.com
MAIL_PASSWORD=qovmhhskozvmifti

# JWT
JWT_SECRET=jwt-secret-ddazzi-fitcoin-hanhyunjin
JWT_ACCESS_TOKEN_VALIDITY=3600000
JWT_REFRESH_TOKEN_VALIDITY=1209600000

# CORS
CORS_ORIGIN_LOCAL_VITE=http://localhost:5173
CORS_ORIGIN_LOCAL_REACT=http://localhost:3000

# PASSWORD
PASSWORD_RESET_URL=http://localhost:3000/password-reset

# Minio
MINIO_ROOT_USER=a504
MINIO_ROOT_PASSWORD=a504a504@
MINIO_API_PORT=9000
MINIO_CONSOLE_PORT=9001
```

#### 프론트엔드 로컬 환경변수 (`.env`)

```env
# API 서버 주소
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080

# MinIO 이미지 스토리지 base URL
NEXT_PUBLIC_MINIO_URL=https://j14a504.p.ssafy.io/minio
```

#### 프론트엔드 배포 환경변수 (`.env`)
```env
# Mock 모드 스위치
# true  → 백엔드 없이 Mock 데이터로 미션 페이지 동작
# false → 실제 API 호출 (백엔드 서버 필요)
NEXT_PUBLIC_USE_MOCK=false

# API 서버 주소
NEXT_PUBLIC_API_BASE_URL=https://j14a504.p.ssafy.io/api

# MinIO 이미지 스토리지 base URL
NEXT_PUBLIC_MINIO_URL=https://j14a504.p.ssafy.io/minio
```

#### 인프라 (`Infra/.env`)
 
```env
# Timezone
TZ=Asia/Seoul

# MySQL
MYSQL_ROOT_PASSWORD=a504a504@
MYSQL_DATABASE=a504
MYSQL_USER=a504
MYSQL_PASSWORD=a504a504@

# Redis
REDIS_PASSWORD=a504a504@

# Minio
MINIO_ROOT_USER=a504
MINIO_ROOT_PASSWORD=a504a504@
```

---

### 3) 배포 시 특이사항 기재

#### 전체 배포 구조
```
GitLab push (main) → Jenkins Webhook
  → 1. 환경변수 파일 주입 (credentials)
  → 2. Frontend Docker Build → Deploy
  → 3. Backend Docker Build → Deploy
  → 4. 이미지 정리 (prune)
```

#### Docker Network
- 모든 컨테이너는 `a504-network` (external) 네트워크 사용
- 최초 1회 생성 필요:
```bash
docker network create a504-network
```

#### Docker Compose 구성
| 파일 | 역할 |
|---|---|
| `Infra/docker-compose.infra.yml` | Nginx, MySQL, Redis, MinIO, Jenkins |
| `Infra/docker-compose.frontend.yml` | Next.js 앱 |
| `Infra/docker-compose.backend.yml` | Spring Boot API 서버 |

#### 최초 인프라 실행 순서
```bash
# 1. 네트워크 생성
docker network create a504-network
 
# 2. 인프라 서비스 실행 (Nginx, MySQL, Redis, MinIO, Jenkins)
docker compose -f Infra/docker-compose.yml up -d
 
# 3. Jenkins에서 Pipeline 실행 → 프론트/백엔드 자동 빌드 및 배포
```
#### 재배포 시 주의사항
- 프론트엔드/백엔드 재배포 시 Jenkins Pipeline 실행
- 컨테이너가 이미 실행 중인 경우 `--force-recreate` 옵션 추가 필요:
```bash
docker compose -f ./Infra/docker-compose.backend.yml up -d --force-recreate
docker compose -f ./Infra/docker-compose.frontend.yml up -d --force-recreate
```
 
#### Nginx
- HTTP(80) → HTTPS(443) 자동 리다이렉트
- SSL 인증서: Let's Encrypt (`/etc/letsencrypt/live/j14a504.p.ssafy.io/`)
- 라우팅:
  - `/` → Next.js (3000)
  - `/api` → Spring Boot (8080)
  - `/minio/` → MinIO S3 API (9000)
  - `/minio-console/` → MinIO 웹 콘솔 (9001)
  - `/jenkins/` → Jenkins (8080)
 
#### MySQL
- 캐릭터셋: `utf8mb4`, `utf8mb4_unicode_ci` (Docker 실행 명령어에 적용됨)
- 포트: 3306
 
#### Redis
- 포트: 6379
- 패스워드 인증 사용 (`requirepass`)
- AOF 영속성 활성화 (`appendonly yes`)
 
#### MinIO
- S3 호환 오브젝트 스토리지
- API 포트: 9000, 웹 콘솔 포트: 9001
- 콘솔 접속: `https://j14a504.p.ssafy.io/minio-console`


---

### 4) DB 접속 정보 등 프로젝트(ERD)에 활용되는 주요 계정 및 프로퍼티가 정의된 파일 목록

| 파일 | 위치 | 설명 |
|---|---|---|
| `application.yml` | `Backend/fitCoin/src/main/resources/` | 공통 설정 |
| `.env` | `Backend/fitCoin/` | 백엔드 환경 변수 (Jenkins credentials로 주입) |
| `.env` | `Frontend/fitCoin/` | 프론트엔드 환경 변수 (Jenkins credentials로 주입) |
| `.env` | `Infra/` | 인프라 환경 변수 (MySQL, Redis, MinIO 등) |
| `docker-compose.yml` | `Infra/` | 인프라 컨테이너 구성 |
| `docker-compose.frontend.yml` | `Infra/` | 프론트엔드 컨테이너 구성 |
| `docker-compose.backend.yml` | `Infra/` | 백엔드 컨테이너 구성 |
| `nginx.conf` | `Infra/` | Nginx 리버스 프록시 설정 |
| `Jenkinsfile` | 프로젝트 루트 | CI/CD 파이프라인 정의 |

---

## 2. 프로젝트에서 사용하는 외부 서비스 정보를 정리한 문서

현재 프로젝트에서 사용하는 별도 외부 서비스(소셜 인증, 클라우드 스토리지, SMS 등)는 없습니다.

단, 아래 내부 서비스는 자체 운영합니다.

| 서비스 | 설명 |
|---|---|
| SMTP (Spring Mail) | 환율 계산 실패 시 관리자 알림 이메일 발송 |
| Redis | 미션 진행 상태, 일일 완료 횟수, 환율 히스토리 캐싱 |

---

## 3. DB 덤프 파일 최신본

- 위치: `[GitLab Repository]/exec/dump/fitcoin_dump.sql`
- 덤프 생성 방법:

```bash
mysqldump -u [USERNAME] -p fitcoin > fitcoin_dump.sql
```

---
