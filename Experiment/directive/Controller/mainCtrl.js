Module

  .controller('mainCtrl', ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout) {
      var scope = $scope;
      var pageList = ['cognition1', 'cognition2', 
      					'learn1', 'learn2', 'learn3',
      					'sendMail'];
      var pageNo = 0;

      $rootScope.$on('changePage', function(events, expResult){
      	$rootScope.$emit(pageList[pageNo], expResult);
      	pageNo ++;
      });

      $rootScope.$on('sendMail', function(events, expResult){
      	sendEmail(expResult);
      });
  }])