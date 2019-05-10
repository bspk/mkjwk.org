FROM maven:3-jdk-8 AS builder

RUN mkdir /build
WORKDIR /build
ADD . /build
RUN mvn -Dmaven.test.skip=true -Dmaven.javadoc.skip=true package

FROM openjdk:8-jre-alpine

COPY --from=builder /build/target/ROOT.war /app.jar
ENTRYPOINT [ "sh", "-c", "java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -jar /app.jar" ]