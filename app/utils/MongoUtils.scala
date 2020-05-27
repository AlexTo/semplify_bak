package utils

import play.api.libs.json.{Json, Writes}
import reactivemongo.api.bson.BSONDocument
import reactivemongo.api.bson.collection.BSONSerializationPack
import reactivemongo.api.bson.collection.BSONSerializationPack.Document
import reactivemongo.api.indexes.{Index, IndexType}
import reactivemongo.api.indexes.Index.Aux

object MongoUtils {

  type Pack = BSONSerializationPack.type
  val pack: Pack = BSONSerializationPack

  implicit def writes: Writes[Document] = { elems =>
    Json.toJson(elems.toMap map {
      f => f._1 -> f._2.toString
    })
  }

  def index(key: Seq[(String, IndexType)],
            name: Option[String] = None,
            unique: Boolean = true,
            background: Boolean = false,
            dropDups: Boolean = false,
            sparse: Boolean = false,
            version: Option[Int] = None, // let MongoDB decide
            partialFilter: Option[BSONDocument] = None,
            options: BSONDocument = BSONDocument.empty): Aux[Pack]
  = Index[Pack](pack)(key, name, unique, background, dropDups, sparse, None, None, None, None, None, None, None,
    None, None, None, None, None, None, version, partialFilter, options)
}
