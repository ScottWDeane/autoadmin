Originally my bachelor capstone project. Revamped and rewritten to become a Cypress showcase.

To start from scratch:

1. make sure you have an OpenJDK Java 17.0.11 lying around
2. either point $JAVA_HOME to your openjdk java 17.0.11, or use some other way to force your Maven/IntelliJ to build with OpenJDK Java 17.0.11
3. if you don't plan on using port 8081, make sure you change all instances of 8081 to whatever port you want to use (don't forget the server.port and the cors.allowedOrigins)
4. create the "autoadmin" postgres database with the "autoadminuser" superuser with full permissions. Example sql:
5.          i. CREATE DATABASE autoadmin;
            ii. CREATE ROLE autoadminuser WITH LOGIN SUPERUSER PASSWORD 'Pa$$wor_D';
            iii. GRANT ALL PRIVILEGES ON DATABASE autoadmin TO autoadminuser;
6. double check the application.properties file is using the correct port and user login info
7. navigate to root, run command "mvn clean install". Will only need to be done once. This handles the back-end and front-end (npm installs, too!)
8. recommended useful command for building and running: `mvn clean install | mvn spring-boot:run`
9. access by navigating to http://localhost:8081 , or whatever port you changed it to
10. default login is: user, Pa$$wor_D