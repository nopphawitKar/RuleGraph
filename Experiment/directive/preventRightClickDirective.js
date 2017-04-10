Module
.directive('disableRightClick', function() {  
    return {  
        restrict: 'A',  
        link: function(scope, element, attr) {  
            element.bind('contextmenu', function(e) {  
                e.preventDefault();  
            })  
        }  
    }  
})  