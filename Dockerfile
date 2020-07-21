FROM maven:3-openjdk-14 AS builder

RUN mkdir /build
WORKDIR /build
ADD . /build
RUN mvn -Dmaven.test.skip=true -Dmaven.javadoc.skip=true package

FROM openjdk:14-jdk-alpine

COPY --from=builder /build/target/ROOT.war /app.jar
ENTRYPOINT [ "sh", "-c", "java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -jar /app.jar" ]
