package modules.sparql.utils

import org.eclipse.rdf4j.model.{BNode, IRI, Literal, Value}

import scala.jdk.javaapi.OptionConverters

object ValueUtils {
  def createValue(value: Value): modules.sparql.models.Value = value match {
    case iri: IRI => modules.sparql.models.IRI(value = iri.stringValue())
    case literal: Literal => modules.sparql.models.Literal(
      value = literal.stringValue(),
      lang = OptionConverters.toScala(literal.getLanguage),
      dataType = literal.getDatatype.stringValue())
    case bnode: BNode => modules.sparql.models.BNode(value = bnode.stringValue())
  }
}
