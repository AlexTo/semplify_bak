package modules.entityhub.models

import play.api.libs.json.{Json, Reads, Writes}

case class IRI(override val projectId: String,
               override val graph: Option[String],
               override val value: String) extends Value

object IRI {
  implicit val reads: Reads[IRI] = Json.reads[IRI]
  implicit val writes: Writes[IRI] = Json.writes[IRI]
}
