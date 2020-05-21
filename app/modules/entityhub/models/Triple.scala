package modules.entityhub.models

import play.api.libs.json.{Json, OWrites, Reads}

case class Triple(projectId: String,
                  graph: Option[String],
                  subj: IRI,
                  pred: IRI,
                  obj: Value)

object Triple {
  implicit val reads: Reads[Triple] = Json.reads[Triple]
  implicit val writes: OWrites[Triple] = Json.writes[Triple]
}

