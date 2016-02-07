<?php

namespace GO\Leavedays;


class LeavedaysModule extends \GO\Professional\Module{
	
	public function autoInstall() {
		return true;
	}
	
	public static function initListeners() {
		$userController = new \GO\Users\Controller\UserController();
		$userController->addListener('load', "GO\Leavedays\LeavedaysModule", "userLoaded");
		$userController->addListener('submit', "GO\Leavedays\LeavedaysModule", "userSubmitted");
		\GO\Base\Model\User::model()->addListener('delete', 'GO\Leavedays\LeavedaysModule', 'userDeleted');
	}
	
	public static function userLoaded( \GO\Users\Controller\UserController $userController, &$response, &$userModel, &$loadParams ) {
			
		$wwModel = \GO\Base\Model\WorkingWeek::model()->findSingleByAttribute('user_id',$userModel->id);
		if (empty($wwModel))
			$wwModel = new \GO\Base\Model\WorkingWeek();

		
		$attr=$wwModel->getAttributes();
		unset($attr['user_id']);
		
		$response['data']=array_merge($attr, $response['data']);

	}
	
	public static function userSubmitted( \GO\Users\Controller\UserController $userController, &$response, &$userModel, &$submitParams, $modifiedAttributes ) {
		
			$wwModel = \GO\Base\Model\WorkingWeek::model()->findSingleByAttribute('user_id',$userModel->id);
			if (empty($wwModel))
				$wwModel = new \GO\Base\Model\WorkingWeek();

			$wwModel->user_id = $userModel->id;
			
			$params = array(
				'mo_work_hours'	=> $submitParams['mo_work_hours'],
				'tu_work_hours'	=> $submitParams['tu_work_hours'],
				'we_work_hours'	=> $submitParams['we_work_hours'],
				'th_work_hours'	=> $submitParams['th_work_hours'],
				'fr_work_hours'	=> $submitParams['fr_work_hours'],
				'sa_work_hours'	=> $submitParams['sa_work_hours'],
				'su_work_hours'	=> $submitParams['su_work_hours']
			);
			
			$wwModel->setAttributes($params);


			if (!$wwModel->save()) {
				$validationErrors = $wwModel->getValidationErrors();			
				throw new \Exception(\GO::t('couldNotSaveWW','leavedays').' '.implode(', ',$validationErrors));
			}
					
	}
	
	public static function userDeleted(\GO\Base\Model\User $userModel) {
		
		if (self::userHasPermission($userModel->id)) {

			$ldsStmt = Model\Leaveday::model()->findByAttribute('user_id',$userModel->id);
			if (!empty($ldsStmt))
				foreach ($ldsStmt as $ldModel)
					$ldModel->delete();

			$ycsStmt = Model\YearCredit::model()->findByAttribute('user_id',$userModel->id);
			if (!empty($ycsStmt))
				foreach ($ycsStmt as $ycModel)
					$ycModel->delete();

		}
		
	}
	
	public static function userHasPermission($userId) {
		
		$level = \GO\Base\Model\Acl::getUserPermissionLevel(\GO::modules()->leavedays->acl_id, $userId);
						
		
		return $level >= \GO\Base\Model\Acl::READ_PERMISSION;
		
	}
	
}