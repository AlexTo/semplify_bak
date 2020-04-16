package modules.entityhub.models

import play.api.libs.json.{Json, OWrites, Reads}

case class Literal(projectId: String,
                   graph: Option[String],
                   value: String,
                   lang: Option[String],
                   dataType: String) extends Value

object Literal {
  implicit val reads: Reads[Literal] = Json.reads[Literal]
  implicit val writes: OWrites[Literal] = Json.writes[Literal]
}
