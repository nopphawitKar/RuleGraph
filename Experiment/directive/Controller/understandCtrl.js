Module

  .controller('understandCtrl', ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout) {
      var scope = $scope;
      scope.startButtonShow = false;
      scope.understandTestShow = false;
      scope.timeCapture = {start: 0, end: 0}
      scope.completeState = false;
      var testData = [];

      scope.start = function(){
        scope.startButtonShow = false;
        scope.understandTestShow = true;
        var date = new Date();
        scope.timeCapture.start = date.getTime();
      }

      scope.closeFormDelay = function(){
        scope.completeState = true;
        $timeout(function(){
            scope.understandTestShow = false;
            $rootScope.$emit('changePage', testData);
        }, 1000);
      };

      scope.$on('changeNode', function(events, node){

        if(node.name === '{Movie_DVD=Y}'){
          var date = new Date();
          scope.timeCapture.end = date.getTime();
          var timeSpend = scope.timeCapture.end - scope.timeCapture.start;
          testData.push('Understandbility Test1 Complete. You spend ' + timeSpend + 'MilliSeconds');
          // console.log('Understandbility Test1 Complete. You spend ' + timeSpend + 'MilliSeconds');
          scope.closeFormDelay();
        }
        scope.$digest();
      });

      $rootScope.$on('cognition1', function(events, prevData){
        testData.push(prevData);
        scope.startButtonShow = true;
      });
  }])