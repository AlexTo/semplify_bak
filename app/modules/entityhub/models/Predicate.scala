package modules.entityhub.models

import play.api.libs.json.{Json, OWrites, Reads}

case class Predicate(override val projectId: String,
                     override val graph: Option[String],
                     override val value: String,
                     from: IRI,
                     to: Value) extends Value

object Predicate {
  implicit val reads: Reads[Predicate] = Json.reads[Predicate]
  implicit val writes: OWrites[Predicate] = Json.writes[Predicate]
}

