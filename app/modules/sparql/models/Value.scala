package modules.sparql.models

import play.api.libs.json.{Reads, Writes, __}

trait Value {
  val `type`: String
}

object Value {
  implicit val reads: Reads[Value] =
    __.read[Literal].map(x => x: Value) orElse
      __.read[IRI].map(x => x: Value) orElse
      __.read[BNode].map(x => x: Value)

  implicit val writes: Writes[Value] = Writes[Value] {
    case iri: IRI => IRI.writes.writes(iri)
    case literal: Literal => Literal.writes.writes(literal)
    case bNode: BNode => BNode.writes.writes(bNode)
  }
}