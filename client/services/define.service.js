(()=>{
	angular
		.module('workoutlog')
		.service('DefineService',DefineService);
		DefineService.$inject=['$http','API_BASE'];
		function DefineService(http,API_BASE){
			var ds=this;
			ds.userDefinitions=[];
			ds.save=function(definition){
				return http.post(API_BASE+'definition',{
					definition:definition
				}).then(res=>ds.userDefinitions.unshift(res.data));
			};
			ds.fetch=definition=>{
				return http.get(API_BASE+'definition').then(res=>{ds.userDefinitions=res.data;});
			}
			ds.getDifinitions=()=>ds.userDefinitions;
		}
})();