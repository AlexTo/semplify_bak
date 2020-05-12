package modules.facebook.controllers

import com.restfb.types.User
import com.restfb.{Connection, DefaultFacebookClient, DefaultJsonMapper, Version}
import javax.inject.{Inject, Singleton}
import play.api.libs.json.Json
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}

import scala.concurrent.{ExecutionContext, Future}

@Singleton
class FbController @Inject()(cc: ControllerComponents)
                            (implicit ec: ExecutionContext) extends AbstractController(cc) {

  def test: Action[AnyContent] = Action.async { request =>

    val appId = ""
    val appSecret = ""
    val token = ""

    val accessToken = new DefaultFacebookClient(Version.LATEST).obtainAppAccessToken(appId, appSecret)
    val fbClient = new DefaultFacebookClient(token, Version.LATEST)
    val user: Connection[User] = fbClient.fetchConnection("100045264821035/friends", classOf[User])
    val jsonMapper = new DefaultJsonMapper

    val userJson = jsonMapper.toJson(user).toString
    Future(Ok(Json.parse(userJson)))
  }
}
