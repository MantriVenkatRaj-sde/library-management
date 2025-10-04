# Dockerfile (Maven multi-stage, Java 21)
# -------- build stage --------
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /workspace

# copy pom first to cache dependencies
COPY pom.xml .
RUN mvn -B -fn dependency:go-offline

# copy source and build the jar (skip tests to speed up)
COPY src ./src
RUN mvn -B -DskipTests package

# -------- runtime stage --------
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# copy the jar from build stage
COPY --from=build /workspace/target/*.jar app.jar

# create non-root user (recommended)
RUN addgroup -S app && adduser -S app -G app
USER app

EXPOSE 8080
ENV JAVA_OPTS=""
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar /app/app.jar"]
