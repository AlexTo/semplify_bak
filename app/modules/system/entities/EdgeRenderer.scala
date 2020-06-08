package modules.system.entities

import modules.entityhub.models.IRI
import modules.system.entities.EdgeFilterMode.EdgeFilterMode
import play.api.libs.json.{Json, OFormat}
import reactivemongo.bson.{BSONDocumentHandler, Macros}

case class EdgeRenderer(includePreds: Seq[IRI],
                        excludePreds: Seq[IRI],
                        filterMode: EdgeFilterMode,
                        groupPreds: Boolean,
                        groupPredsIfCountExceed: Int)

object EdgeRenderer {
  implicit val handler: BSONDocumentHandler[EdgeRenderer] = Macros.handler[EdgeRenderer]
  implicit val format: OFormat[EdgeRenderer] = Json.format[EdgeRenderer]
}
