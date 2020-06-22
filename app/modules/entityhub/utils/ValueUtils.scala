package modules.entityhub.utils

import modules.entityhub.models.CompoundNode
import org.eclipse.rdf4j.model.vocabulary.XMLSchema
import org.eclipse.rdf4j.model.{BNode, IRI, Literal, Value}

import scala.jdk.javaapi.OptionConverters

object ValueUtils {
  def createValue(projectId: String, graph: Option[String],
                  value: Value): modules.entityhub.models.Value = {
    value match {
      case iri: IRI =>
        modules.entityhub.models.IRI(projectId, graph, iri.stringValue())
      case literal: Literal =>
        modules.entityhub.models.Literal(projectId, graph, literal.getLabel,
          OptionConverters.toScala(literal.getLanguage),
          if (literal.getDatatype != null) Some(literal.getDatatype.stringValue()) else None)
      case bNode: BNode =>
        modules.entityhub.models.BNode(projectId, graph, bNode.getID)
    }
  }

  def createCompoundNode(projectId: String, graph: Option[String], value: String,
                         subj: String, pred: String, prefLabel: String): modules.entityhub.models.Value = {
    CompoundNode(projectId, graph,
      value, subj, pred, modules.entityhub.models.Literal(projectId, graph, prefLabel, None, None))
  }
}
