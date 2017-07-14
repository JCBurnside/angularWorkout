(()=>{
	var app=angular.module('workoutlog',[
		'ui.router',
		'workoutlog.auth.signin',
		'workoutlog.auth.signup',
		'workoutlog.define',
		'workoutlog.logs',
		'workoutlog.history']);
	function config($urlRouterProvider){
		$urlRouterProvider.otherwise('/signin');
	}
	config.$inject=['$urlRouterProvider'];
	app.config(config);
	app.constant('API_BASE','//localhost:3000/api/');
})();
(()=>{
	angular.module('workoutlog.define',[
		'ui.router'
	])
	.config(defineConfig);
	function defineConfig(stateProvider){
		stateProvider.state('define',{
			url:'/define',
			templateUrl:'/components/define/define.html',
			controller:DefineController,
			controllerAs:'ctrl',
			bindToController:this,
			resolve:[
				'CurrentUser','$q','$state',
				function(CurrentUser,$q,$state){
					var deferred=$q.defer();
					if(CurrentUser.isSignedIn())deferred.resolve();
					else {
						deferred.reject();
						$state.go('signin');
					}
					return deferred.promise;
				}]
		});
	}
	defineConfig.$inject=['$stateProvider'];

	function DefineController($state,DefineService){
		var vm=this;
		vm.message="Define a workout category here";
		vm.saved=false;
		vm.definition={};
		vm.save=()=>DefineService.save(vm.definition).then(()=>{vm.saved=true;$state.go('logs');});
	}
	DefineController.$inject=['$state','DefineService'];
})();
(()=>{
	angular
		.module('workoutlog.auth.signin',['ui.router'])
		.config(signinConfig);
	function signinConfig(stateProvider) {
		stateProvider
			.state('signin',{
				url:'/signin',
				templateUrl:'/components/auth/signin.html',
				controller:SigninController,
				controllerAs:'ctrl',
				bindToController:this
			});
	}
	signinConfig.$inject=['$stateProvider'];
	function SigninController($state,UsersService){
		var vm=this;
		vm.user={};
		vm.login=()=>{
			UsersService.login(vm.user).then(res=>{
				console.log(res);
				$state.go('define');
			});
		};
	}
	SigninController.$inject=['$state','UsersService'];	
})();

(()=>{
	angular
		.module('workoutlog.auth.signup',['ui.router'])
		.config(signupConfig);
		function signupConfig($stateProvider){
			$stateProvider
			.state('signup',{
				url:'/signup',
				templateUrl:'/components/auth/signup.html',
				controller:SignUpController,
				controllerAs:'ctrl',
				bindToController:this
			});
		}
		signupConfig.$inject=['$stateProvider'];
		function SignUpController($state,UsersService){
			var vm=this
			vm.user={};
			vm.message="Sign up for an account!";
			vm.submit=function(){
				console.log(vm.user);
				UsersService.create(vm.user).then(function(res){
					console.log(res);
					$state.go('define');
				});
			};
		}
		SignUpController.$inject=['$state','UsersService'];
})();
(function(){
	angular.module('workoutlog')
	.directive('userlinks',
		function() {
			UserLinksController.$inject=['$state','CurrentUser','SessionToken'];
			function UserLinksController($state,CurrentUser,SessionToken) {
				var vm=this;
				vm.user=()=>CurrentUser.get();
				vm.signedIn=()=>!!(vm.user().id);
				vm.logout=()=>{
					CurrentUser.clear();
					SessionToken.clear();
					$state.go('signin');
				}
			}
			return {
				scope:{},
				controller:UserLinksController,
				controllerAs:'ctrl',
				bindToController:true,
				templateUrl:'/components/auth/userlinks.html'
			}
		})
})();
(()=>{
	angular.module('workoutlog.logs',[
		'ui.router'
	])
	.config(logsConfig);
	logsConfig.$inject=['$stateProvider'];
	function logsConfig($stateProvider) {
		$stateProvider
			.state('logs',{
				url:'/logs',
				templateUrl:'/components/logs/logs.html',
				controller:LogsController,
				controllerAs:'ctrl',
				bindToController:this,
				resolve:{
					getUserDefinitions:[
						'DefineService',
						DefineService=>DefineService.fetch()
					]
				}
			})
			.state('logs/update',{
				url:'/logs/:id',
				templateUrl:'/components/logs/log-update.html',
				controller:LogsController,
				controllerAs:'ctrl',
				bindToController:this,
				resolve:{
					getSingleLog:($stateParams,LogsService)=>LogsService.fetchOne($stateParams.id),
					getUserDefinitions:DefineService=>DefineService.fetch()
				}
			});
	}
	LogsController.$inject=['$state','DefineService','LogsService'];
	function LogsController($state,DefineService,LogsService) {
		var vm=this;
		vm.saved=false;
		vm.log={};
		vm.userDefinitions=DefineService.getDefinitions();
		vm.updateLog=LogsService.getLog();
		vm.save=()=>LogsService.save(vm.log).then(()=>{
			console.log(vm.log)
			vm.saved=true;
			$state.go('history');
		});
		vm.updateSingleLog=()=>{
			var logToUpdate={
				id:vm.updateLog.id,
				desc:vm.updateLog.description,
				result:vm.updateLog.result,
				def:vm.updateLog.def
			}
			LogsService.updateLog(logToUpdate).then(()=>$state.go('history'));
		};
	}
})();
(()=>{
	angular.module('workoutlog.history',[
		'ui.router'
	])
	.config(historyConfig);
	historyConfig.$inject=['$stateProvider'];
	function historyConfig($stateProvider){
		$stateProvider
			.state('history',{
				url:'/history',
				templateUrl:'/components/history/history.html',
				controller:HistoryController,
				controllerAs:'ctrl',
				bindToController:this,
				resolve:{
					getUserLogs:[
						'LogsService',
						function(LogsService){
							return LogsService.fetch();
						}
					]
				}
			});
	}
	HistoryController.$inject=['$state','LogsService'];
	function HistoryController($state,LogsService) {
		var vm=this;
		vm.history=LogsService.getLogs();
		console.log(vm.history);
		vm.delete=function(item) {
			LogsService.deleteLogs(item);
		}

		vm.updateLog=function(item){
			$state.go('logs/update',{'id':item.id})
		}
	}
})();
(()=>{
	angular.module('workoutlog')
		.factory('AuthInterceptor',['SessionToken','API_BASE',
			function(SessionToken,API_BASE){
				return {
					request:function(config){
						var token=SessionToken.get();
						if(token&&config.url.indexOf(API_BASE)>-1){
							config.headers['Authorization']=token;
						}
						return config
					}
				};
			}
		]);
	angular.module('workoutlog')
		.config(['$httpProvider',function($httpProvider){
			return $httpProvider.interceptors.push('AuthInterceptor')
		}]);
})();
(function(){
	angular.module('workoutlog')
		.service('CurrentUser',['$window',function($window){
			function CurrentUser(){
				var cu=$window.localStorage.getItem('currentUser');
				if(cu&&cu!=='undefined')this.cu=JSON.parse($window.localStorage.getItem('currentUser'));
			}
			CurrentUser.prototype.set = function(user) {
				this.cu=user;
				$window.localStorage.setItem('currentUser',JSON.stringify(user));
			};
			CurrentUser.prototype.get = function() {
				return this.cu||{};
			};
			CurrentUser.prototype.clear = function() {
				this.cu=undefined;
				$window.localStorage.removeItem('currentUser');
			};
			CurrentUser.prototype.isSignedIn = function() {
				return !!this.get().id;
			};
			return new CurrentUser();
		}]);
})();
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
			ds.getDefinitions=()=>ds.userDefinitions;
		}
})();
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
(function(){
	angular.module('workoutlog')
		.service('SessionToken',['$window',function($window){
			function SessionToken(){
				this.sessionToken=$window.localStorage.getItem('sessionToken');
			}
			SessionToken.prototype.set = function(token) {
				this.sessionToken=token;
				$window.localStorage.setItem('sessionToken',token);
			};
			SessionToken.prototype.get = function() {
				return this.sessionToken;
			};
			SessionToken.prototype.clear = function() {
				this.sessionToken=undefined;
				$window.localStorage.removeItem('sessionToken');
			};
			return new SessionToken();
		}]);
})();
(function(){
	angular.module('workoutlog')
		.service('UsersService',[
			'$http','API_BASE','SessionToken','CurrentUser',
			function($http,API_BASE,SessionToken,CurrentUser){
				function UsersService(){

				}
				UsersService.prototype.create = function(user) {
					var userPromise=$http.post(API_BASE+'user',{
						user:user
					});
					userPromise.then(function(res){
						SessionToken.set(res.data.sessionToken);
						CurrentUser.set(res.data.user);
					});
					return userPromise;
				};
				UsersService.prototype.login = function(user) {
					var loginPromise=$http.post(API_BASE+'login',{
						user:user
					});
					loginPromise.then(function(res){
						SessionToken.set(res.data.sessionToken);
						CurrentUser.set(res.data.user);
					});
					return loginPromise;
				};
				return new UsersService();
			}
		]);
})();
//# sourceMappingURL=bundle.js.map
