Module

  .controller('understandCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
      var scope = $scope;
      scope.understandTestShow = false;
      scope.timeCapture = {start: 0, end: 0}

      var start = function(){
        scope.understandTestShow = true;
        var date = new Date();
        scope.timeCapture.start = date.getTime();
      }

      scope.$on('changeNode', function(events, node){
        if(node.name === 'LegendItem'){
          scope.understandTestShow = false;
          var date = new Date();
          scope.timeCapture.end = date.getTime();
          var timeSpend = scope.timeCapture.end - scope.timeCapture.start;
          console.log('Understandbility Test Complete. You spend ' + timeSpend + 'MilliSeconds');

          $rootScope.$emit('callLearnForm', true);
          // scope.$broadcast('callLearnForm', true);
        }
        scope.$digest();
      });

      scope.$on('callTestForm', function(events, startStatus){
        start();
      });
  }])