FROM openjdk:11-jre-slim
WORKDIR /app
COPY build/jar/OrderManagement.jar .
ENTRYPOINT ["java", "-jar", "OrderManagement.jar"]
