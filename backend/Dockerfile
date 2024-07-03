ARG BD_URL
ARG BD_USERNAME
ARG BD_PASSWORD

FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src

ENV BD_PASSWORD=$BD_PASSWORD
ENV BD_USERNAME=$BD_USERNAME
ENV BD_URL=$BD_URL


RUN mvn clean package -DskipTests
FROM eclipse-temurin:22.0.1_8-jre-ubi9-minimal

WORKDIR /app
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar /app/backend.jar
CMD ["java", "-jar", "backend.jar"]
