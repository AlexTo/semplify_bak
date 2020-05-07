package modules.project.models

import modules.project.models.RepositoryType.RepositoryType
import play.api.libs.json._

trait Repository {
  val `type`: RepositoryType
}

object Repository {
  implicit val reads: Reads[Repository] = (s: JsValue) => {
    (s \ "type").as[RepositoryType] match {
      case RepositoryType.Virtuoso => VirtuosoRepository.reads.reads(s)
      case RepositoryType.Native => NativeRepository.reads.reads(s)
    }
  }

  implicit val writes: Writes[Repository] = Writes[Repository] {
    case native: NativeRepository => NativeRepository.writes.writes(native)
    case virtuoso: VirtuosoRepository => VirtuosoRepository.writes.writes(virtuoso)
  }
}
