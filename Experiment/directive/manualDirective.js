Module

.controller('manualCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
	var scope = $scope;
	scope.isShow = true;
	scope.closeManual = function(){
		scope.isShow = false;

		if (!scope.$$phase){
			scope.$apply();
		}
	};

	scope.$watch('isShow', function(newVal, oldVal){
		if(newVal == false & oldVal == true){
			$rootScope.$emit('changePage', '');
		}
    	// console.log(newVal);
 	}, true);

  }])


.directive('manual', function () {

return {
	restrict: 'E',
	scope: {
	},
	templateUrl: './directive/html/manual.html'
}
});