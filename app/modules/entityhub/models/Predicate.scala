package modules.entityhub.models

import play.api.libs.json.{Json, OWrites, Reads}

case class Predicate(projectId: String,
                     graph: Option[String],
                     value: String,
                     from: IRI,
                     to: Value) extends Value

object Predicate {
  implicit val reads: Reads[Predicate] = Json.reads[Predicate]
  implicit val writes: OWrites[Predicate] = Json.writes[Predicate]
}

