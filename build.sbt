name := """semplify"""
organization := "ai.semplify"

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala).settings(
  watchSources ++= (baseDirectory.value / "public" ** "*").get
)

scalaVersion := "2.13.1"

libraryDependencies ++= Seq(
  guice, ehcache, ws, filters,
  "org.pac4j" %% "play-pac4j" % "10.0.0",
  "org.pac4j" % "pac4j-oidc" % "4.0.0",
  "org.pac4j" % "pac4j-http" % "4.0.0",
  "org.sangria-graphql" %% "sangria" % "2.0.0-RC2",
  "org.sangria-graphql" %% "sangria-slowlog" % "2.0.0-M1",
  "org.sangria-graphql" %% "sangria-play-json" % "2.0.1",
  "org.reactivemongo" % "play2-reactivemongo_2.13" % "0.20.10-play28",
  "org.reactivemongo" %% "reactivemongo-play-json-compat" % "0.20.10-play28",
  "org.reactivemongo" %% "reactivemongo-bson-macros" % "0.20.10",
  "com.restfb" % "restfb" % "3.5.0",
  "com.jayway.jsonpath" % "json-path" % "2.4.0",
  "org.eclipse.rdf4j" % "rdf4j-storage" % "3.2.1",
  "org.eclipse.rdf4j" % "rdf4j-sail-lucene" % "3.2.1",
  "edu.uci.ics" % "crawler4j" % "4.4.0",
  "org.apache.tika" % "tika-core" % "1.24",
  "org.apache.tika" % "tika-parsers" % "1.24",
  "com.google.guava" % "guava" % "28.2-jre",
  "com.typesafe.play" % "play-cache_2.13" % "2.8.2",
  "org.scalatestplus.play" %% "scalatestplus-play" % "5.0.0" % Test).map(_.excludeAll(ExclusionRule("org.slf4j")))

resolvers ++= Seq(
  Resolver.mavenLocal,
  "scalaz-bintray" at "https://dl.bintray.com/scalaz/releases",
  "Sonatype snapshots repository" at "https://oss.sonatype.org/content/repositories/snapshots/",
  "Shibboleth releases" at "https://build.shibboleth.net/nexus/content/repositories/releases/",
  "MuleSoft" at "https://repository.mulesoft.org/nexus/content/repositories/public/"
)

routesGenerator := InjectedRoutesGenerator

fork in run := true