package modules.entityhub.utils

import org.eclipse.rdf4j.model.{BNode, IRI, Literal, Value}

import scala.jdk.javaapi.OptionConverters

object ValueUtils {
  def createValue(projectId: String, graph: Option[String], value: Value): modules.entityhub.models.Value = {
    value match {
      case iri: IRI =>
        modules.entityhub.models.IRI(projectId, graph, iri.stringValue())
      case literal: Literal =>
        modules.entityhub.models.Literal(projectId, graph, literal.getLabel,
          OptionConverters.toScala(literal.getLanguage),
          literal.getDatatype.stringValue())
      case bNode: BNode =>
        modules.entityhub.models.BNode(projectId, graph, bNode.getID)
    }
  }
}
