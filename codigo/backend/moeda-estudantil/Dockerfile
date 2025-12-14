FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /workspace

# Copy only what is necessary to cache Maven dependencies
COPY pom.xml mvnw ./
COPY .mvn .mvn
RUN mvn -B -DskipTests dependency:go-offline

# Copy the project sources and build the application
COPY src ./src
COPY ./*.xml ./
RUN mvn -B -DskipTests package


FROM eclipse-temurin:21-jre AS runtime

ARG JAVA_OPTS=""
ENV TZ=UTC
ENV PORT=8080
ENV JAVA_OPTS=""
EXPOSE 8080

# Copy the built jar from the builder stage
COPY --from=build /workspace/target/*.jar /app/app.jar

# Ensure the application binds to the port provided by the environment (Render sets $PORT)
# Spring already honors `server.port=${PORT:8080}` in application.properties, but adding
# -Dserver.port ensures the JVM will use the env var if present.
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -Dserver.port=${PORT} -jar /app/app.jar"]
