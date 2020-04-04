package modules.security

import com.google.inject.{AbstractModule, Provides}
import org.pac4j.core.client.Clients
import org.pac4j.core.config.Config
import org.pac4j.core.profile.CommonProfile
import org.pac4j.http.client.direct.HeaderClient
import org.pac4j.oidc.config.OidcConfiguration
import org.pac4j.oidc.credentials.authenticator.UserInfoOidcAuthenticator
import org.pac4j.play.scala.{DefaultSecurityComponents, Pac4jScalaTemplateHelper, SecurityComponents}
import org.pac4j.play.store.{PlayCacheSessionStore, PlaySessionStore}
import play.api.{Configuration, Environment}


class SecurityModule(env: Environment, conf: Configuration) extends AbstractModule {

  val clientId: String = conf.get[String]("app.keycloak.clientId")
  val secret: String = conf.get[String]("app.keycloak.secret")
  val discoveryUri: String = conf.get[String]("app.keycloak.discoveryUri")

  override def configure(): Unit = {
    bind(classOf[PlaySessionStore]).to(classOf[PlayCacheSessionStore])
    bind(classOf[SecurityComponents]).to(classOf[DefaultSecurityComponents])
    bind(classOf[Pac4jScalaTemplateHelper[CommonProfile]])
  }

  @Provides
  def headerClient: HeaderClient = {
    val config = new OidcConfiguration()
    config.setClientId(clientId)
    config.setSecret(secret)
    config.setDiscoveryURI(discoveryUri)
    val authenticator = new UserInfoOidcAuthenticator(config)
    new HeaderClient("Authorization", "Bearer ", authenticator)
  }


  @Provides
  def provideConfig(headerClient: HeaderClient): Config = {
    val clients = new Clients(headerClient)

    val config = new Config(clients)
    config
  }
}