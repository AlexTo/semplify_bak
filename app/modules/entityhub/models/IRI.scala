package modules.entityhub.models

import play.api.libs.json.{Json, OFormat}
import reactivemongo.bson.{BSONDocumentHandler, Macros}

case class IRI(override val projectId: String,
               override val graph: Option[String],
               override val value: String) extends Value

object IRI {
  implicit val format: OFormat[IRI] = Json.format[IRI]
  implicit val handler: BSONDocumentHandler[IRI] = Macros.handler[IRI]
}
