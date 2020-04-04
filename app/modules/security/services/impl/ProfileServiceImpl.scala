package modules.security.services.impl

import java.util.Optional

import javax.inject.Inject
import modules.security.services.ProfileService
import org.pac4j.core.profile.ProfileManager
import org.pac4j.oidc.profile.OidcProfile
import org.pac4j.play.PlayWebContext
import org.pac4j.play.store.PlaySessionStore
import play.api.mvc.Request

class ProfileServiceImpl @Inject()(sessionStore: PlaySessionStore) extends ProfileService {
  override def getProfile(request: Request[Any]): Optional[OidcProfile] = {
    val webContext = new PlayWebContext(request, sessionStore)
    val profileManager = new ProfileManager[OidcProfile](webContext)
    profileManager.get(true)
  }
}
