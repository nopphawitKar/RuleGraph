Module

	.controller('bioController', ['$scope','$rootScope', function($scope, $rootScope) {
		var scope = $scope;
		scope.completeBio = false;
		scope.subjectBio = {year: 0,
							expYear: 0,
							age: 0,
							knowRule: false,
							sex: 0};
		scope.knowRuleToggle = function(knowRule) {
			scope.subjectBio.knowRule = knowRule;
		}

		scope.submitForm = function(){
			scope.completeBio = true;
			// $rootScope.$emit('callTestForm', scope.subjectBio);
			$rootScope.$emit('changePage', scope.subjectBio);
		}

		scope.$watch('subjectBio', function(newVal, oldVal){
		    console.log(newVal);
		}, true);
	}])


	.directive('bioDirective', function () {

		return {
			restrict: 'E',
			scope: {
			},
			templateUrl: './directive/subjectBio.html'
		}
	});