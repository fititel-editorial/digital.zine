# ============================================================================
# Stage 1 - Build (Maven + JDK 21)
# ============================================================================
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Cache dependencies before copying sources
COPY pom.xml .
RUN mvn -q dependency:go-offline

COPY src ./src
RUN mvn -q package -DskipTests

# ============================================================================
# Stage 2 - Runtime (JRE 21 only)
# ============================================================================
FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
