package modules.common.exceptions

import play.api.libs.json.{Json, OFormat}

case class ProjectNotFoundException(projectId: String) extends Throwable

object ProjectNotFoundException {
  implicit val format: OFormat[ProjectNotFoundException] = Json.format[ProjectNotFoundException]
}
