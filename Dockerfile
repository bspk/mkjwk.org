FROM maven:3.9.11-eclipse-temurin-21-noble AS builder

RUN mkdir /build
WORKDIR /build
ADD . /build
RUN mvn -Dmaven.test.skip=true -Dmaven.javadoc.skip=true package

FROM eclipse-temurin:21.0.9_10-jre-ubi10-minimal

COPY --from=builder /build/target/ROOT.war /app.jar
ENTRYPOINT [ "sh", "-c", "java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -jar /app.jar" ]
