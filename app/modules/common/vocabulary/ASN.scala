package modules.common.vocabulary

import org.eclipse.rdf4j.model.IRI
import org.eclipse.rdf4j.model.impl.SimpleValueFactory

object ASN {
  val NAMESPACE = "http://purl.org/ASN/schema/core/"
  val factory: SimpleValueFactory = SimpleValueFactory.getInstance
  val statementNotation: IRI = factory.createIRI(NAMESPACE, "statementNotation")
  val statementLabel: IRI = factory.createIRI(NAMESPACE, "statementLabel")
  val indexingStatus: IRI = factory.createIRI(NAMESPACE, "indexingStatus")
  val teachesCompetency: IRI = factory.createIRI(NAMESPACE, "teachesCompetency")
}
