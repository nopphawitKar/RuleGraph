Module

.controller('lastPageCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
    var scope = $scope;
    scope.lastPage = false;
 
	$rootScope.$on('lastPage', function(events){
		scope.lastPage = true;
	});

  }])


.directive('lastPage', function () {

return {
	restrict: 'E',
	scope: {
  		type: '@'
	},
	templateUrl: './directive/html/lastPage.html',
	link: function (scope, element, attrs) {

	}
}
});