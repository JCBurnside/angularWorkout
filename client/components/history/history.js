(()=>{
	angular.module('workoutlog.history',[
		'ui.router'
	])
	.config(historyConfig);
	historyConfig.$inject=['$stateProvider'];
	function historyConfig($stateProvider){
		
	}
})();