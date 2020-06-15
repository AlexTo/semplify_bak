package modules.entityhub.models

import play.api.libs.json.{Json, OFormat}

case class Triple(projectId: String,
                  graph: Option[String],
                  subj: IRI,
                  pred: IRI,
                  obj: Value)

object Triple {
  implicit val format: OFormat[Triple] = Json.format[Triple]
}

