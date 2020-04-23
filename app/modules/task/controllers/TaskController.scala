package modules.task.controllers

import akka.actor.ActorRef
import akka.pattern.ask
import akka.util.Timeout
import javax.inject.{Inject, Named}
import modules.task.models.{StopTask, TaskCreate, TaskGet}
import modules.task.services.TaskService
import play.api.libs.json.{JsObject, JsValue, Json}
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents, Request}

import scala.concurrent.ExecutionContext
import scala.concurrent.duration._

class TaskController @Inject()(@Named("taskManager") taskManager: ActorRef,
                               taskService: TaskService,
                               cc: ControllerComponents)
                              (implicit ec: ExecutionContext) extends AbstractController(cc) {

  implicit val timeout: Timeout = 5.seconds

  def create: Action[JsValue] = Action.async(parse.json) { request: Request[JsValue] =>
    val task = request.body.as[TaskCreate]
    (taskManager ? task).mapTo[TaskGet].map {
      task => Ok(Json.toJson(task))
    }
  }

  def update: Action[JsValue] = Action.async(parse.json) { request: Request[JsValue] =>
    val req = request.body.as[JsObject]
    val action = (req \ "action").as[String].toLowerCase

    action match {
      case "stop" =>
        (taskManager ? req.as[StopTask]).mapTo[Int].map { n =>
          Ok(Json.toJson(n))
        }
    }
  }

  def findAll: Action[AnyContent] = Action.async { _ =>
    taskService.findAll map {
      tasks => Ok(Json.toJson(tasks))
    }
  }

}
