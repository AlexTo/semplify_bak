package modules.project.models

import play.api.libs.json.{JsPath, Json, OWrites, Reads}
import play.api.libs.functional.syntax._

case class ProjectGet(id: String, title: String)

object ProjectGet {
  implicit val writes: OWrites[ProjectGet] = Json.writes[ProjectGet]
  implicit val reads: Reads[ProjectGet] = (
    (JsPath \ "_id" \ "$oid").read[String] and
      (JsPath \ "title").read[String]
    ) (ProjectGet.apply _)
}
