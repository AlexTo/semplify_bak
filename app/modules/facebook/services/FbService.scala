package modules.facebook.services

import com.google.inject.ImplementedBy
import modules.facebook.services.impl.FbServiceImpl

@ImplementedBy(classOf[FbServiceImpl])
trait FbService {

}
