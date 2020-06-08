package modules.entityhub.models

import play.api.libs.json.{Json, OFormat}
import reactivemongo.bson.{BSONDocumentHandler, Macros}

case class Literal(override val projectId: String,
                   override val graph: Option[String],
                   override val value: String,
                   lang: Option[String],
                   dataType: String) extends Value

object Literal {
  implicit val format: OFormat[Literal] = Json.format[Literal]
  implicit val handler: BSONDocumentHandler[Literal] = Macros.handler[Literal]
}
