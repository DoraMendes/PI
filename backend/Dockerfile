FROM maven:3.9-eclipse-temurin-21-alpine AS build

ARG DB_HOST
ARG DB_USERNAME
ARG DB_PASSWORD

WORKDIR /app
COPY pom.xml .
COPY src ./src

ENV DB_PASSWORD=$DB_PASSWORD
ENV DB_USERNAME=$DB_USERNAME
ENV DB_HOST=$DB_HOST


RUN mvn clean package -DskipTests
FROM eclipse-temurin:22.0.1_8-jre-ubi9-minimal

WORKDIR /app
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar /app/backend.jar
CMD ["java", "-jar", "backend.jar"]
