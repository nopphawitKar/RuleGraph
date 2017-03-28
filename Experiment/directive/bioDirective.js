Module

	.controller('bioController', ['$scope','$rootScope', function($scope, $rootScope) {
		var scope = $scope;
		scope.isShow = false;
		scope.subjectBio = {year: 0,
							expYear: 0,
							age: 0,
							knowRule: false,
							sex: 0};
		scope.knowRuleToggle = function(knowRule) {
			scope.subjectBio.knowRule = knowRule;
		}

		scope.submitForm = function(){
			scope.isShow = false;
			$rootScope.$emit( 'changePage', JSON.stringify(scope.subjectBio) );
		}

		$rootScope.$on('bio', function(events){
			scope.isShow = true;
			
			if (!$scope.$$phase){
				$scope.$apply();
			}
		});

		// scope.$watch('subjectBio', function(newVal, oldVal){
		//     console.log(newVal);
		// }, true);
	}])


	.directive('bioDirective', function () {

		return {
			restrict: 'E',
			scope: {
			},
			templateUrl: './directive/html/subjectBio.html'
		}
	});