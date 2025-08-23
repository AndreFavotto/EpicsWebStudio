FROM alpine/git:latest AS source_fetch

ARG PVWS_SOURCE='https://github.com/ornl-epics/pvws.git'
ARG PVWS_GIT_TAG=main
RUN git clone ${PVWS_SOURCE} /pvws
RUN cd /pvws && git checkout ${PVWS_GIT_TAG}

FROM maven:3.8.7-eclipse-temurin-17 AS maven_builder

COPY --from=source_fetch /pvws /pvws
RUN cd /pvws && mvn clean package 

FROM tomcat:9.0-jdk17

ARG PVWS_PORT=8080
COPY --from=maven_builder /pvws/target/pvws.war ${CATALINA_HOME}/webapps
COPY ./setenv.sh ${CATALINA_HOME}/bin
RUN sed -i.bak -e "s|Connector port=\"8080\"|Connector port=\"${PVWS_PORT}\"|g" \
  -e 's|Server port="8005" shutdown="SHUTDOWN"|Server port="-1" shutdown="SHUTDOWN"|g' \
   ${CATALINA_HOME}/conf/server.xml