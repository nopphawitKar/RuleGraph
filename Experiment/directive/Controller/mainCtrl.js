Module

  .controller('mainCtrl', ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout) {
      var scope = $scope;
      var pageList = ['bio', 'plainUnderstand',
                'cognition1', 'cognition2', 'cognition3',
      					'plainLearn', 'learn1', 'learn2', 'learn3',
      					'sendMail', 'lastPage'];
      scope.pageNo = 0;

      $rootScope.$on('changePage', function(events, expResult){
      	$rootScope.$emit(pageList[scope.pageNo], expResult);
      	scope.pageNo ++;
      });

      $rootScope.$on('sendMail', function(events, expResult){
      	sendEmail(expResult);
        $rootScope.$emit('lastPage');
      });
  }])