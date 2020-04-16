package modules.entityhub.utils

import org.eclipse.rdf4j.model.{BNode, IRI, Literal, Value}

import scala.jdk.javaapi.OptionConverters

object ValueUtils {
  def createValue(repositoryId: String, graph: Option[String], value: Value): modules.entityhub.models.Value = {
    value match {
      case iri: IRI =>
        modules.entityhub.models.IRI(repositoryId, graph, iri.stringValue())
      case literal: Literal =>
        modules.entityhub.models.Literal(repositoryId, graph, literal.getLabel,
          OptionConverters.toScala(literal.getLanguage),
          literal.getDatatype.stringValue())
      case bNode: BNode =>
        modules.entityhub.models.BNode(repositoryId, graph, bNode.getID)
    }
  }
}
