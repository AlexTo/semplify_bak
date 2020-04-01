package modules.fileserver.services

import com.google.inject.ImplementedBy
import modules.fileserver.services.impl.FileServiceImpl

@ImplementedBy(classOf[FileServiceImpl])
trait FileService {

}
