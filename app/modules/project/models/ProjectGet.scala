package modules.project.models

import play.api.libs.functional.syntax._
import play.api.libs.json.{Json, OWrites, Reads, __}

case class ProjectGet(id: String, title: String)

object ProjectGet {
  implicit val writes: OWrites[ProjectGet] = Json.writes[ProjectGet]
  implicit val reads: Reads[ProjectGet] = (
    (__ \ "_id" \ "$oid").read[String] and
      (__ \ "title").read[String]
    ) (ProjectGet.apply _)
}
