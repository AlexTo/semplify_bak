package modules.entityhub.models

import play.api.libs.json._

trait Value {
  val projectId: String
  val graph: Option[String]
  val value: String
}

object Value {
  implicit val reads: Reads[Value] =
    __.read[Predicate].map(x => x: Value) orElse
      __.read[Literal].map(x => x: Value) orElse
      __.read[IRI].map(x => x: Value) orElse
      __.read[BNode].map(x => x: Value)


  implicit val writes: Writes[Value] = Writes[Value] {
    case iri: IRI => IRI.writes.writes(iri)
    case literal: Literal => Literal.writes.writes(literal)
    case predicate: Predicate => Predicate.writes.writes(predicate)
    case bNode: BNode => BNode.writes.writes(bNode)
  }
}
