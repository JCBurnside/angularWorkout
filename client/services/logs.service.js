(()=>{
	angular.module('workoutlog')
		.service('LogsService',LogsService);
	LogsService.$inject=['$http','API_BASE']
	function LogsService($http,API_BASE,DefineService) {
		var logsService=this;
		logsService.workouts=[];
		logsService.individualLog={};

		logsService.fetch=function(){
			return $http.get(API_BASE+'log').then(res=>logsService.workouts=res.data)
		};
		logsService.save=log=>$http.post(API_BASE+'log',{log:log}).then(data=>logsService.workouts.push(data));
		logsService.getLogs=function(){ return $http.get(API_BASE+'log').then(res=>logsService.workouts=res.data);};
		logsService.deleteLogs=log=>{
			var logIndex=logsService.workouts.indexOf(log);
			logsService.workouts.splice(logIndex,1);
			var deleteData={log:log};
			return $http({
				method:'DELETE',
				url:API_BASE+"log",
				data:JSON.stringify(deleteData),
				headers:{"Content-Type":"application/json"}
			});
		};
		logsService.fetchOne=log=>$http.get(API_BASE+'log/'+log).then(res=>logsService.individualLog=res.data);
		logsService.getLog=()=>logsService.individualLog;
		logsService.updateLog=logToUpdate=>$http.put(API_BASE+'log',{log:logToUpdate});
	}
})();