# 1단계: 빌드
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

RUN chmod +x ./gradlew
# 의존성만 먼저 다운로드 (캐시 활용)
RUN ./gradlew dependencies --no-daemon

COPY src src
RUN ./gradlew clean build -x test --no-daemon

# 2단계: 실행 (JRE로 변경 - JDK보다 가벼움)
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# JAR를 레이어로 분리 (변경 잦은 앱 코드와 변경 적은 라이브러리 분리)
COPY --from=builder /app/build/libs/*SNAPSHOT.jar app.jar
RUN java -Djarmode=layertools -jar app.jar extract

COPY --from=builder /app/build/libs/*SNAPSHOT.jar app.jar

EXPOSE 8080

# 컨테이너 종료 시그널 처리 + 타임존 설정
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]