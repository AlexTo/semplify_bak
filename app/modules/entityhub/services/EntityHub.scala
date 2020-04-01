package modules.entityhub.services

import com.google.inject.ImplementedBy
import modules.entityhub.services.impl.EntityHubImpl

@ImplementedBy(classOf[EntityHubImpl])
trait EntityHub {

}
