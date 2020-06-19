package modules.common.models

import play.api.libs.json.{Json, OFormat}

case class Error(error: ErrorBody)


case class ErrorBody(message: String)

object ErrorBody {
  implicit val format: OFormat[ErrorBody] = Json.format[ErrorBody]
}

object Error {
  implicit val format: OFormat[Error] = Json.format[Error]
}
