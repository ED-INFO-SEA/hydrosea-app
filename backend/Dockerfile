FROM maven:3.9.11-eclipse-temurin-21 AS construction
WORKDIR /src
COPY pom.xml ./
RUN mvn -B dependency:go-offline
COPY src src
RUN mvn -B -DskipTests package
FROM eclipse-temurin:21.0.8_9-jre
RUN useradd --system --uid 10001 hydrosea
WORKDIR /app
COPY --from=construction /src/target/hydrosea-backend-*.jar application.jar
USER 10001
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/application.jar"]

