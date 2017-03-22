Module

  .controller('understandIndentCtrl', ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout) {
      var scope = $scope;
      scope.startButtonShow = false;
      scope.understandTestShow = false;
      scope.timeCapture = {start: 0, end: 0}
      scope.completeState = false;
      var testData;

      scope.start = function(){
        scope.startButtonShow = false;
        scope.understandTestShow = true;
        var date = new Date();
        scope.timeCapture.start = date.getTime();
      }

      scope.closeFormDelay = function(){
        // scope.understandTestShow = 'delay';
        scope.completeState = true;
        $timeout(function(){
            scope.understandTestShow = false;
            $rootScope.$emit('callLearnForm', testData);
        }, 1000);
      };

      $rootScope.$on('changeIndentNode', function(events, node){
        if(node.name === '{Movie_DVD=Y}'){
          var date = new Date();
          scope.timeCapture.end = date.getTime();
          var timeSpend = scope.timeCapture.end - scope.timeCapture.start;
          // console.log('Understandbility Test2 Complete. You spend ' + timeSpend + 'MilliSeconds');
          testData.push('Understandbility Test2 Complete. You spend ' + timeSpend + 'MilliSeconds');
          scope.closeFormDelay();
        }
        scope.$digest();
      });

      $rootScope.$on('callUnderstand2', function(events, testDataInput){
        // start();
        testData = testDataInput;
        scope.startButtonShow = true;
        // scope.$digest();
      });
  }])