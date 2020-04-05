package modules.rml.services

import com.google.inject.ImplementedBy
import modules.rml.services.impl.RMLServiceImpl

import scala.concurrent.Future

@ImplementedBy(classOf[RMLServiceImpl])
trait RMLService {
  def execute(dataFileId: String, mappingFileId: String, outputFormat: String): Future[String]
}
