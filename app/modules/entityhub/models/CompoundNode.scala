package modules.entityhub.models

import play.api.libs.json.{Json, OFormat}
import reactivemongo.bson.{BSONDocumentHandler, Macros}

case class CompoundNode(override val projectId: String,
                        override val graph: Option[String],
                        override val value: String,
                        subj: String, pred: String,
                        prefLabel: Literal) extends Value

object CompoundNode {
  implicit val format: OFormat[CompoundNode] = Json.format[CompoundNode]
  implicit val handler: BSONDocumentHandler[CompoundNode] = Macros.handler[CompoundNode]
}
