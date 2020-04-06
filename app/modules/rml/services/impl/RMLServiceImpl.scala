package modules.rml.services.impl


import java.io.{BufferedInputStream, ByteArrayOutputStream, File, FileInputStream}

import akka.stream.Materializer
import akka.stream.scaladsl.FileIO
import be.ugent.rml.records.RecordsFactory
import be.ugent.rml.store.{QuadStore, QuadStoreFactory, RDF4JStore}
import be.ugent.rml.{Executor, Utils}
import com.google.common.io.Files
import javax.inject.Inject
import modules.fileserver.services.FileService
import modules.rml.services.RMLService
import play.api.Configuration

import scala.concurrent.{ExecutionContext, Future}

class RMLServiceImpl @Inject()(fileService: FileService, conf: Configuration)(implicit ec: ExecutionContext, m: Materializer)
  extends RMLService {

  override def execute(dataFileId: String, mappingFileId: String): Future[QuadStore] = {
    val tmpDir = Files.createTempDir()
    for {
      dataFile <- fileService.get(dataFileId)
      dataTempFile = new File(tmpDir, dataFile.filename)

      mappingFile <- fileService.get(mappingFileId)
      mappingTempFile = new File(tmpDir, mappingFile.filename)
      _ <- dataFile.content.runWith(FileIO.toPath(dataTempFile.toPath))
      _ <- mappingFile.content.runWith(FileIO.toPath(mappingTempFile.toPath))

    } yield {
      mappingTempFile.deleteOnExit()
      dataTempFile.deleteOnExit()
      val mappingStream = new BufferedInputStream(new FileInputStream(mappingTempFile))
      val rmlStore = QuadStoreFactory.read(mappingStream)
      val factory = new RecordsFactory(dataTempFile.getParent)
      val outputStore = new RDF4JStore

      val executor = new Executor(rmlStore, factory, null, outputStore,
        Utils.getBaseDirectiveTurtle(mappingStream))

      executor.execute(null)
    }
  }

  override def executeAsString(dataFileId: String, mappingFileId: String, outputFormat: String): Future[String] = {
    execute(dataFileId, mappingFileId).map(quadStore => {
      val output = new ByteArrayOutputStream();
      quadStore.write(output, outputFormat)
      new String(output.toByteArray)
    })
  }
}
