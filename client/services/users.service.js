(function(){
	angular.module('workoutlog')
		.service('UserSevice',[
			'$http','API_BASE','SessionToken','CurrentUser',
			function(http,API_BASE,SessionToken,CurrentUser){
				function UsersService(){

				}
				UsersService.prototype.create = function(user) {
					var userPromise=http.post(API_BASE+'user',{
						user:user
					});
					userPromise.then(function(res){
						SessionToken.set(res.data.sessionToken);
						CurrentUser.set(res.data.user);
					});
					return userPromise;
				};
				UsersService.prototype.login = function(user) {
					var loginPromise=http.post(API_BASE+'login',{
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