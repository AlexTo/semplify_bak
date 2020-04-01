package controllers

import javax.inject._
import org.pac4j.core.profile.ProfileManager
import org.pac4j.oidc.profile.keycloak.KeycloakOidcProfile
import org.pac4j.play.PlayWebContext
import org.pac4j.play.store.PlaySessionStore
import play.api.mvc._

@Singleton
class HomeController @Inject()(sessionStore: PlaySessionStore, val controllerComponents: ControllerComponents)
  extends BaseController {

  def index(): Action[AnyContent] = Action { implicit request: Request[AnyContent] =>
    val webContext = new PlayWebContext(request, sessionStore)
    val profileManager = new ProfileManager[KeycloakOidcProfile](webContext)
    val profile = profileManager.get(true)
    Ok("haha")
  }
}
