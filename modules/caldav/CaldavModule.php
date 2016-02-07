<?php

namespace GO\Caldav;


class CaldavModule extends \GO\Professional\Module {
	
	public function depends() {
		return array("dav","sync","calendar");
	}
	
	public static function initListeners() {
		
		if(\GO::modules()->isInstalled('calendar'))			
			\GO\Calendar\Model\Event::model()->addListener("delete", "GO\Caldav\CaldavModule", "deleteEvent");
		
		if(\GO::modules()->isInstalled('tasks'))			
			\GO\Tasks\Model\Task::model()->addListener("delete", "GO\Caldav\CaldavModule", "deleteTask");
		
	}
	
	public static function deleteEvent(\GO\Calendar\Model\Event $event){
		Model\DavEvent::model()->deleteByAttribute('id', $event->id);
	}
	
	public static function deleteTask(\GO\Tasks\Model\Task $task){
		Model\DavTask::model()->deleteByAttribute('id', $task->id);
	}
}