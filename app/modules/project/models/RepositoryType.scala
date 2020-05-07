package modules.project.models

import play.api.libs.json.{Reads, Writes}
import utils.EnumUtils

object RepositoryType extends Enumeration {
  type RepositoryType = Value
  val Native, Virtuoso = Value
  implicit val reads: Reads[RepositoryType.Value] = EnumUtils.enumReads(RepositoryType)

  implicit def writes: Writes[RepositoryType] = EnumUtils.enumWrites
}
