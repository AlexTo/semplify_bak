package modules.entityhub.utils

import modules.entityhub.models.{Edge, Node}
import org.eclipse.rdf4j.model.{BNode, IRI, Literal, Value}

import scala.jdk.javaapi.OptionConverters

object ValueUtils {
  def createNode(repositoryId: String, graph: String, value: Value): Node = {
    value match {
      case iri: IRI =>
        Node(repositoryId, graph, iri.stringValue(), "uri")
      case literal: Literal =>
        Node(repositoryId, graph, literal.getLabel, "literal",
          OptionConverters.toScala(literal.getLanguage),
          Some(literal.getDatatype.stringValue()))
      case bNode: BNode =>
        Node(repositoryId, graph, bNode.getID, "bnode")
    }
  }
}
