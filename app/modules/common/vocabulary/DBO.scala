package modules.common.vocabulary

import org.eclipse.rdf4j.model.impl.SimpleValueFactory

object DBO {
  val NAMESPACE = "http://dbpedia.org/ontology/"
  val factory: SimpleValueFactory = SimpleValueFactory.getInstance
  val birthName = factory.createIRI(NAMESPACE, "birthName")
}
