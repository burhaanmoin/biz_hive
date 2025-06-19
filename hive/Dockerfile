# Use an official OpenJDK runtime as a parent image
FROM eclipse-temurin:17-jdk

# Set the working directory in the container
WORKDIR /app

# Copy the Maven wrapper and pom.xml files
COPY .mvn .mvn
COPY mvnw pom.xml ./

# Copy the rest of your application code
COPY src src

# Build the application
RUN ./mvnw clean package -DskipTests

# Run the Spring Boot app
CMD ["java", "-jar", "target/*.jar"] 