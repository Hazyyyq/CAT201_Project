# --- Stage 1: Build the WAR file ---
# We use a Maven image with Java 17 to compile your code
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy the project files
COPY pom.xml .
COPY src ./src

# Clean and package the application into a WAR
# -DskipTests speeds up the build and avoids test failures during deploy
RUN mvn clean package -DskipTests

# --- Stage 2: Run in Tomcat Web Server ---
# We use Tomcat 10.1 which supports Jakarta Servlet 6.0 (used in your pom)
FROM tomcat:10.1-jdk17

# Remove default Tomcat example apps to keep it clean
RUN rm -rf /usr/local/tomcat/webapps/*

# Copy your built WAR file to Tomcat
# We rename it to 'ROOT.war' so your API is at "https://url.com/api"
# instead of "https://url.com/backend-1.0-SNAPSHOT/api"
COPY --from=build /app/target/backend-1.0-SNAPSHOT.war /usr/local/tomcat/webapps/ROOT.war

# Expose the standard Tomcat port
EXPOSE 8080

# Start the web server
CMD ["catalina.sh", "run"]