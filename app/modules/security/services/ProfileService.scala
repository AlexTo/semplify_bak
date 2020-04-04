package modules.security.services

import java.util.Optional

import com.google.inject.ImplementedBy
import modules.security.services.impl.ProfileServiceImpl
import org.pac4j.oidc.profile.OidcProfile
import play.api.mvc.Request

@ImplementedBy(classOf[ProfileServiceImpl])
trait ProfileService {
  def getProfile(request: Request[Any]): Optional[OidcProfile]
}
