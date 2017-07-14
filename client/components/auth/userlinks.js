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