Module

.controller('collapeTreeCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
    var ctrl = this;
    var scope = $scope;
    var testData;
    // var date = new Date();
    // scope.time = '10.32 sec';
    scope.nodeId = 0;
    scope.timeCapture = {start: 0, end: 0};
    scope.startStatus = false;
    scope.formStatus =false;
    // scope.currentForm = 0;
  	scope.answerChecker = [	{text: '1) {Sausage=Y} --> {Snack=Y,Soft_drink=Y}', id: 20}, 
  							{text: '2) {Yogurt=Y} --> {Snack=Y,Soft_drink=Y,Soap=Y}', id: 24},
  							{text: '3) {Soft_drink=Y, Shampoo=Y} --> {Snack=Y,Tooth_paste=Y}', id: 105},
  							{text: '4) {Ice_cream=Y} --> {Snack=Y,Chocolate=Y}', id: 118},
  							{text: '5) {Chocolate=Y, Ice_cream=Y} --> {Soft_drink=Y}', id: 145},
  							{text: '6) {Chocolate=Y, Soap=Y, Tooth_brush=Y} --> {Tooth_paste=Y}', id: 152},
  							{text: '7) {Milk=Y, Yogurt=Y} --> {Snack=Y,Soft_drink=Y}', id: 177},
  							{text: '8) {Tooth_brush=Y, Milk=Y, Ice_cream=Y} --> {Tooth_paste=Y}', id: 233},
  							{text: '9) {Snack=Y, Chocolate=Y, Ice_cream=Y} --> {Soft_drink=Y}', id: 302},
  							{text: '10) {Shampoo=Y, Milk=Y} --> {Tooth_brush=Y,Tooth_paste=Y}', id: 339},
  							{text: 'complete', id: 'no id'}
  							]
  	scope.currentQuestion = 0;

	var isCorrectNode = function(node) {
		var depth = node.depth;
		var ruleName = '}-->' + node.name;
		var currentNode = node;
		for(var index=1; index < depth; index++){
			if(index == depth-1){
				ruleName = '{' + currentNode.parent.name + ruleName;
			}else{
				ruleName = ',' + currentNode.parent.name + ruleName;
			}
			currentNode = currentNode.parent;
		}

		var words = scope.answerChecker[scope.currentQuestion].text.split(' ');
		var compareTxt = '';
		for(index in words){
			if(index == 0){continue;}
			compareTxt += words[index];
		}

		//clear new line break
		ruleName = clearNewLineBreak(ruleName);
		compareTxt = clearNewLineBreak(compareTxt);

		if(ruleName.localeCompare(compareTxt)==0){
			return true;
		}
		return false;
	};

	scope.start = function(){
		scope.startStatus = false;
		scope.formStatus = true;
		var date = new Date();
		scope.timeCapture.start = date.getTime();
	};

	var clearNewLineBreak = function(text){
		text = text.replace(/\r/g, "");
		return text;
	}
	scope.$on('changeNode', function(events, node){
    	if(isCorrectNode(node)){
    		if(scope.currentQuestion == scope.answerChecker.length-2/*9*//*0*/){
    			var date = new Date();
    			scope.timeCapture.end = date.getTime();
    			var timeConsume = scope.timeCapture.end - scope.timeCapture.start;
    			var resultMessage = 'collapse tree :You use time ' + timeConsume + 'Milliseconds';
    			testData.push(resultMessage);
    			scope.formStatus = false;
    			$rootScope.$emit('changePage', testData);
    		}
    		scope.currentQuestion += 1;
    	}
    	scope.$digest();
  	});

  	$rootScope.$on('learn1', function(events, testDataInput){
  		testData = testDataInput;
  		scope.startStatus = true;
	});

	scope.$watch('nodeId', function(newValue){
		scope.nodeId = newValue;
	}, true);


    scope.isTrueAns = function(){
      var answer = document.getElementById("answerTab").innerHTML;
      console.log('answer' + answer);
      if(answer == 29){
        return true;
      }
      return false;
    }

  }])


.directive('graph', function () {

return {
	restrict: 'E',
	scope: {
  		inputFile: '@',
  		width: '=',
  		height: '='
	},
	link: function (scope, element, attrs) {
		function click(d) {
		  scope.$emit('changeNode', d);
		  if (!scope.$$phase){
 			scope.$apply();
 		  }

		  if (d.children) {
		    d._children = d.children;
		    d.children = null;
		  } else {
		    d.children = d._children;
		    d._children = null;
		  }
		  update(d);
		}

		var margin = {top: 20, right: 120, bottom: 20, left: 120},
	    width = 960 - margin.right - margin.left,
	    height = 800 - margin.top - margin.bottom;
	    if(scope.width > 0 && scope.height > 0){
	    	width = scope.width;
	    	height = scope.height;
	    }

		var i = 0,
		    duration = 750,
		    root;

		var tree = d3.layout.tree()
		    .size([height, width]);

		var diagonal = d3.svg.diagonal()
		    .projection(function(d) { return [d.y, d.x]; });

		var svgParentTag = (scope.inputFile == 'rule.json'? 'imagebox' : 'understandBox')
		var svg = d3.select(/*"imagebox"*/svgParentTag).append("svg")
		    .attr("width", width + margin.right + margin.left)
		    .attr("height", height + margin.top + margin.bottom)
		    // .attr("width", "10000000px")
		    // .attr("height", "10000000px")
		  .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		d3.json(/*"rule.json"*/scope.inputFile, function(error, flare) {
		  if (error) throw error;

		  root = flare;
		  root.x0 = height / 2;
		  root.y0 = 0;

		  function collapse(d) {
		    if (d.children) {
		      d._children = d.children;
		      d._children.forEach(collapse);
		      d.children = null;
		    }
		  }

		  root.children.forEach(collapse);
		  update(root);
		});

		d3.select(self.frameElement).style("height", "800px");

		function update(source) {

		  // Compute the new tree layout.
		  var nodes = tree.nodes(root).reverse(),
		      links = tree.links(nodes);

		  // Normalize for fixed-depth.
		  nodes.forEach(function(d) { d.y = d.depth * 180; });

		  // Update the nodes…
		  var node = svg.selectAll("g.node")
		      .data(nodes, function(d) { return d.id || (d.id = ++i); });

		  // Enter any new nodes at the parent's previous position.
		  var nodeEnter = node.enter().append("g")
		      .attr("class", "node")
		      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
		      .on("click", click);

		  nodeEnter.append("circle")
		      .attr("r", 1e-6)
		      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

		  nodeEnter.append("text")
		      .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
		      .attr("dy", ".35em")
		      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
		      .text(function(d) { return d.name; })
		      .style("fill-opacity", 1e-6);

		  // Transition nodes to their new position.
		  var nodeUpdate = node.transition()
		      .duration(duration)
		      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

		  nodeUpdate.select("circle")
		      .attr("r", 4.5)
		      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

		  nodeUpdate.select("text")
		      .style("fill-opacity", 1);

		  // Transition exiting nodes to the parent's new position.
		  var nodeExit = node.exit().transition()
		      .duration(duration)
		      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
		      .remove();

		  nodeExit.select("circle")
		      .attr("r", 1e-6);

		  nodeExit.select("text")
		      .style("fill-opacity", 1e-6);

		  // Update the links…
		  var link = svg.selectAll("path.link")
		      .data(links, function(d) { return d.target.id; });

		  // Enter any new links at the parent's previous position.
		  link.enter().insert("path", "g")
		      .attr("class", "link")
		      .attr("d", function(d) {
		        var o = {x: source.x0, y: source.y0};
		        return diagonal({source: o, target: o});
		      });

		  // Transition links to their new position.
		  link.transition()
		      .duration(duration)
		      .attr("d", diagonal);

		  // Transition exiting nodes to the parent's new position.
		  link.exit().transition()
		      .duration(duration)
		      .attr("d", function(d) {
		        var o = {x: source.x, y: source.y};
		        return diagonal({source: o, target: o});
		      })
		      .remove();

		  // Stash the old positions for transition.
		  nodes.forEach(function(d) {
		    d.x0 = d.x;
		    d.y0 = d.y;
		  });
		}

		// Toggle children on click.
		

	}
}
});