package modules.webcrawler.models

import play.api.libs.functional.syntax._
import play.api.libs.json.{Json, OWrites, Reads, __}

case class PageGet(id: String,
                   projectId: String,
                   url: String,
                   title: Option[String],
                   content: String,
                   contentType: Option[String],
                   domain: String)

object PageGet {
  implicit val writes: OWrites[PageGet] = Json.writes[PageGet]
  implicit val reads: Reads[PageGet] = (
    (__ \ "_id" \ "$oid").read[String] and
      (__ \ "projectId").read[String] and
      (__ \ "url").read[String] and
      (__ \ "title").readNullable[String] and
      (__ \ "content").read[String] and
      (__ \ "contentType").readNullable[String] and
      (__ \ "domain").read[String]
    ) (PageGet.apply _)
}
