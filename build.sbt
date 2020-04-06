name := """semplify"""
organization := "ai.semplify"

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala).settings(
  watchSources ++= (baseDirectory.value / "public/ui" ** "*").get
)

scalaVersion := "2.13.1"

libraryDependencies ++= Seq(
  guice, ehcache, ws, filters,
  "org.pac4j" %% "play-pac4j" % "9.0.0-SNAPSHOT",
  "org.pac4j" % "pac4j-oidc" % "4.0.0-SNAPSHOT",
  "org.pac4j" % "pac4j-http" % "4.0.0-SNAPSHOT",
  "org.sangria-graphql" %% "sangria" % "2.0.0-M4",
  "org.reactivemongo" % "play2-reactivemongo_2.13" % "0.20.3-play28",
  "org.reactivemongo" %% "reactivemongo-play-json-compat" % "0.20.3-play28",
  "commons-lang" % "commons-lang" % "2.6",
  "com.jayway.jsonpath" % "json-path" % "2.4.0",
  "org.rdfhdt" % "hdt-java-core" % "1.1",
  "org.eclipse.rdf4j" % "rdf4j-storage" % "3.2.0-M1",
  "org.eclipse.rdf4j" % "rdf4j-sail-solr" % "3.2.0-M1",
  "org.apache.solr" % "solr-core" % "7.5.0" excludeAll (ExclusionRule("org.apache.logging.log4j")),
  "com.google.guava" % "guava" % "28.2-jre",
  "com.typesafe.play" % "play-cache_2.13" % "2.8.1",
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