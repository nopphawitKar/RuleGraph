Module

	.controller('bioController', ['$scope', function($scope) {
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
			scope.$emit('callTestForm', true);
		}
	}])


	.directive('bioDirective', function () {

		return {
			restrict: 'E',
			scope: {
		  		// val: '=',
		  		// grouped: '=',
			},
			templateUrl: './directive/subjectBio.html'
		}
	});