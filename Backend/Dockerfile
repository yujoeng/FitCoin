# ----------------------------------------------------
# 1단계: 빌드 환경 (요리 과정)
# ----------------------------------------------------
# Java 21이 설치된 환경을 가져옵니다. (Alpine은 용량이 매우 가벼운 리눅스입니다)
FROM eclipse-temurin:21-jdk-alpine AS builder

# 작업할 폴더를 /app으로 지정합니다.
WORKDIR /app

# Gradle 관련 파일들을 먼저 복사합니다. (도커 캐시를 활용해 빌드 속도 향상)
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# 실행 권한을 줍니다.
RUN chmod +x ./gradlew

# 소스 코드를 마저 복사하고, 테스트를 건너뛴 채로 실제 빌드(요리)를 진행합니다.
COPY src src
RUN ./gradlew clean build -x test

# ----------------------------------------------------
# 2단계: 실행 환경 (포장 및 서빙 과정)
# ----------------------------------------------------
# 빌드 도구(Gradle)는 버리고, 순수하게 실행할 수 있는 Java 21 환경만 새로 가져옵니다.
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

# 1단계(builder)에서 완성된 요리(.jar 파일)만 딱 하나 쏙 빼옵니다.
# 스프링 부트 3.x 빌드 시 보통 이름 끝에 -SNAPSHOT.jar가 붙습니다.
COPY --from=builder /app/build/libs/*SNAPSHOT.jar app.jar

# 스프링 부트의 기본 포트인 8080을 열어둡니다.
EXPOSE 8080

# 컨테이너가 켜질 때 이 요리를 실행(Run)하라는 명령어입니다.
ENTRYPOINT ["java", "-jar", "app.jar"]