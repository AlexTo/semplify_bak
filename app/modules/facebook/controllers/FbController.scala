package modules.facebook.controllers

import java.util.Collections

import com.restfb.json.JsonObject
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

    val appId = "3144770955585878"
    val appSecret = "40e70bdb7ed9c5d63bf667d04d831c7f"
    val token = "EAAAAUaZA8jlABAKHNCv94Jzz1zOmtd4HHRKXixpOuNUPsNWy60cq0VJfZCLAIK8E5hXZCDhZAapThcnLzVMWYUZAZBXLZBZBqf3ylTdCKyM8ZBxk8SZBKoXhvOrj79jIhOWImAv0djCyM56GPw5A5jxwizgPTtnq3tyxlyjxFbACqJ7KKcD29AK6jYyfDFYbZBikzsZD"

    val accessToken = new DefaultFacebookClient(Version.LATEST).obtainAppAccessToken(appId, appSecret)
    val fbClient = new DefaultFacebookClient(token, Version.LATEST)
    val user: Connection[User] = fbClient.fetchConnection("100045264821035/friends", classOf[User])
    val jsonMapper = new DefaultJsonMapper

    val userJson = jsonMapper.toJson(user).toString
    Future(Ok(Json.parse(userJson)))
  }
}
