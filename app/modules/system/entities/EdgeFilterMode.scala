package modules.system.entities

import play.api.libs.json.{Reads, Writes}
import reactivemongo.bson.{BSONDocumentHandler, BSONDocumentWriter, BSONReader, BSONString, BSONWriter, Macros}
import utils.EnumUtils

object EdgeFilterMode extends Enumeration {
  type EdgeFilterMode = Value
  val Inclusive, Exclusive = Value
  implicit val reads: Reads[EdgeFilterMode.Value] = EnumUtils.enumReads(EdgeFilterMode)

  implicit def writes: Writes[EdgeFilterMode] = EnumUtils.enumWrites

  implicit object EdgeFilterModeWriter extends BSONWriter[EdgeFilterMode, BSONString] {
    def write(edgeFilterMode: EdgeFilterMode): BSONString = BSONString(edgeFilterMode.toString)
  }

  implicit object EdgeFilterModeReader extends BSONReader[BSONString, EdgeFilterMode] {
    override def read(bson: BSONString): EdgeFilterMode = EdgeFilterMode.withName(bson.value)
  }

}


