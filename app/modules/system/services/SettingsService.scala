package modules.system.services

import com.google.inject.ImplementedBy
import modules.system.entities.VisualGraph
import modules.system.models.{SettingsCreate, SettingsGet, SettingsUpdate}
import modules.system.services.impl.SettingsServiceImpl

import scala.concurrent.Future

@ImplementedBy(classOf[SettingsServiceImpl])
trait SettingsService {
  def findProjectSettings(projectId: String): Future[SettingsGet]

  def findUserSettings(projectId: String, username: String): Future[SettingsGet]

  def create(settings: SettingsCreate): Future[SettingsGet]

  def update(settingsId: String, settings: SettingsUpdate): Future[Int]

  def updateVisualGraphSettings(settingsId: String, visualGraphSettings: VisualGraph): Future[Int]
}
