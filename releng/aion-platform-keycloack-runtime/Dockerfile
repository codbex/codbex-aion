# Docker descriptor for codbex
# License - http://www.eclipse.org/legal/epl-v20.html

FROM tomcat:9.0.56-jre11-openjdk AS base

RUN rm -R /usr/local/tomcat/webapps.dist

COPY target/ROOT.war $CATALINA_HOME/webapps/
RUN unzip $CATALINA_HOME/webapps/ROOT.war -d $CATALINA_HOME/webapps/ROOT
RUN rm $CATALINA_HOME/webapps/ROOT.war

RUN curl https://repo1.maven.org/maven2/org/keycloak/keycloak-tomcat8-adapter-dist/4.0.0.Beta3/keycloak-tomcat8-adapter-dist-4.0.0.Beta3.zip --create-dirs -o /usr/local/tomcat/lib/keycloak-tomcat8-adapter-dist.zip
RUN cd /usr/local/tomcat/lib && unzip keycloak-tomcat8-adapter-dist.zip
COPY src/main/webapp/META-INF/context.xml /usr/local/tomcat/webapps/ROOT/META-INF/
COPY src/main/webapp/WEB-INF/keycloak.json /usr/local/tomcat/webapps/ROOT/WEB-INF/
COPY src/main/webapp/WEB-INF/keycloak.json /usr/local/tomcat/webapps/ROOT/WEB-INF/

RUN wget https://search.maven.org/remotecontent?filepath=org/postgresql/postgresql/42.5.0/postgresql-42.5.0.jar -P /usr/local/tomcat/lib/

RUN mkdir -p /usr/local/tomcat/target/dirigible/repository/root/registry/public/

FROM gcr.io/distroless/base-debian11

ENV DIRIGIBLE_HOME_URL=/services/v4/js/aion-ext/index.mjs
ENV CATALINA_HOME=/usr/local/tomcat

USER nonroot
COPY --from=base --chown=nonroot:nonroot $CATALINA_HOME $CATALINA_HOME
WORKDIR $CATALINA_HOME

COPY --from=base /usr/local/openjdk-11 /usr/lib/java
COPY --from=base /lib/x86_64-linux-gnu/libz.so.1 /lib/x86_64-linux-gnu/libz.so.1
COPY --from=base /usr/lib/x86_64-linux-gnu/libstdc++.so.6 /lib/x86_64-linux-gnu/libstdc++.so.6
COPY --from=base /lib/x86_64-linux-gnu/libgcc_s.so.1 /lib/x86_64-linux-gnu/libgcc_s.so.1

ENV JAVA_HOME /usr/lib/java
ENV PATH $PATH:$JAVA_HOME/bin

EXPOSE 8080 

CMD ["java", \
 "-Djava.util.logging.config.file=/usr/local/tomcat/conf/logging.properties", \
 "--add-opens=java.base/java.lang=ALL-UNNAMED", \
 "--add-opens=java.base/java.lang.reflect=ALL-UNNAMED", \
 "-Djava.util.logging.manager=org.apache.juli.ClassLoaderLogManager", \
 "-Djdk.tls.ephemeralDHKeySize=2048", \
 "-Djava.protocol.handler.pkgs=org.apache.catalina.webresources", \
 "-Dorg.apache.catalina.security.SecurityListener.UMASK=0027", \
 "-Dignore.endorsed.dirs=", \
 "-classpath", \
 "/usr/local/tomcat/bin/bootstrap.jar:/usr/local/tomcat/bin/tomcat-juli.jar", \
 "-Dcatalina.base=/usr/local/tomcat/", \
 "-Dcatalina.home=/usr/local/tomcat/", \
 "-Djava.io.tmpdir=/usr/local/tomcat/temp", \
 "org.apache.catalina.startup.Bootstrap", \
 "start" \
]

ENTRYPOINT []