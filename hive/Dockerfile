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
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# Debug: list files in the target directory
RUN ls -l target

# Run the Spring Boot app (update the JAR name if needed)
CMD ["java", "-jar", "target/hive-0.0.1-SNAPSHOT.jar"] 