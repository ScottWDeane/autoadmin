FROM maven:3.8.1-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean install -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/autoadmin-0.0.1-SNAPSHOT.jar /app/autoadmin.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "/app/autoadmin.jar"]
