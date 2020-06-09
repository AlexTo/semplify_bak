FROM openjdk:8-jdk-alpine

ARG REACT_APP_KEYCLOAK_URL
ARG REACT_APP_KEYCLOAK_REALM
ARG REACT_APP_KEYCLOAK_CLIENT_ID

ENV SCALA_VERSION 2.13.1
ENV SBT_VERSION 1.3.8
ENV SEMPLIFY_VERSION "1.0-SNAPSHOT"

ENV PATH /sbt/bin:$PATH

RUN apk add --no-cache git npm bash unzip

RUN \
  wget -O - https://downloads.typesafe.com/scala/$SCALA_VERSION/scala-$SCALA_VERSION.tgz | tar xfz - -C /root/ && \
  echo >> /root/.bashrc && \
  echo "export PATH=~/scala-$SCALA_VERSION/bin:$PATH" >> /root/.bashrc

# Install SBT
RUN wget https://piccolo.link/sbt-$SBT_VERSION.tgz && \
  tar -xzvf sbt-$SBT_VERSION.tgz && \
  sbt sbtVersion

WORKDIR /root

RUN git clone https://github.com/AlexTo/semplify.git

WORKDIR /root/semplify

RUN \
  git checkout dev && \
  echo -e "HOST=0.0.0.0\n\
DANGEROUSLY_DISABLE_HOST_CHECK=true\n\
REACT_APP_KEYCLOAK_URL=${REACT_APP_KEYCLOAK_URL}\n\
REACT_APP_KEYCLOAK_REALM=${REACT_APP_KEYCLOAK_REALM}\n\
REACT_APP_KEYCLOAK_CLIENT_ID=${REACT_APP_KEYCLOAK_CLIENT_ID}" >> ./ui/.env

RUN sbt dist

WORKDIR /root

RUN unzip ./semplify/target/universal/semplify-$SEMPLIFY_VERSION.zip -d .

EXPOSE 9000

CMD ["sh", "-c", "/root/semplify-$SEMPLIFY_VERSION/bin/semplify"]