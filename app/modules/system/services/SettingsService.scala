package modules.system.services

import com.google.inject.ImplementedBy
import modules.system.models.{SettingsCreate, SettingsGet}
import modules.system.services.impl.SettingsServiceImpl

import scala.concurrent.Future

@ImplementedBy(classOf[SettingsServiceImpl])
trait SettingsService {
  def findProjectSettings(projectId: String): Future[SettingsGet]

  def findUserSettings(projectId: String, username: String): Future[SettingsGet]

  def create(settings: SettingsCreate): Future[SettingsGet]
}
