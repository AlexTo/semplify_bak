package modules.task.models

import play.api.libs.json.{Reads, Writes}
import utils.EnumUtils

object TaskStatus extends Enumeration {
  type TaskStatus = Value
  val Queued, Started, Finished, Stopped, Stopping = Value
  implicit val reads: Reads[TaskStatus.Value] = EnumUtils.enumReads(TaskStatus)

  implicit def writes: Writes[TaskStatus] = EnumUtils.enumWrites
}
