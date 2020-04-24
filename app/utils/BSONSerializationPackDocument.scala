package utils

import play.api.libs.json.{Json, Writes}
import reactivemongo.api.bson.collection.BSONSerializationPack.Document

object BSONSerializationPackDocument {
  implicit def writes: Writes[Document] = { elems =>
    Json.toJson(elems.toMap map {
      f => f._1 -> f._2.toString
    })
  }
}
