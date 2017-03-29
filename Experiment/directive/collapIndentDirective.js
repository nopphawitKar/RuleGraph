Module

.controller('indentCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
    var scope = $scope;
    scope.testData;
    scope.startStatus = false;
    scope.formStatus = false;
    scope.endCredit = false;
    scope.timeCapture = {start: 0, end: 0};
  	scope.answerChecker = [	{text: '1) {Sausage=Y} --> {Snack=Y,Soft_drink=Y}', id: 20}, 
  							{text: '2) {Yogurt=Y} --> {Snack=Y,Soft_drink=Y,Soap=Y}', id: 24},
  							{text: '3) {Soft_drink=Y, Shampoo=Y} --> {Snack=Y,Tooth_paste=Y}', id: 105},
  							{text: '4) {Ice_cream=Y} --> {Snack=Y,Chocolate=Y}', id: 118},
  							{text: '5) {Chocolate=Y, Ice_cream=Y} --> {Soft_drink=Y}', id: 145},
  							{text: '6) {Chocolate=Y, Soap=Y, Tooth_brush=Y} --> {Tooth_paste=Y}', id: 152},
  							{text: '7) {Milk=Y, Yogurt=Y} --> {Snack=Y,Soft_drink=Y}', id: 177},
  							{text: '8) {Tooth_brush=Y, Milk=Y, Ice_cream=Y} --> {Tooth_paste=Y}', id: 233},
  							{text: '9) {Snack=Y, Chocolate=Y, Ice_cream=Y} --> {Soft_drink=Y}', id: 302},
  							{text: '10) {Shampoo=Y, Milk=Y, } --> {Tooth_brush=Y,Tooth_paste=Y}', id: 339},
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
	scope.$on('changeIndentNode', function(events, node){
    	if(isCorrectNode(node)){
    		if(scope.currentQuestion == scope.answerChecker.length-2){
    			var date = new Date();
    			scope.timeCapture.end = date.getTime();
    			var timeConsume = scope.timeCapture.end - scope.timeCapture.start;
    			var resultMessage = 'Indent: You use time ' + timeConsume + 'Milliseconds';
    			scope.testData.push(resultMessage);
    			scope.formStatus = false
    			scope.startStatus = false
    			$rootScope.$emit('changePage', scope.testData);
    		}
    		scope.currentQuestion += 1;
    	}
    	scope.$digest();
  	});

  	$rootScope.$on('learn2', function(events, testDataInput){
  		// scope.start();
  		scope.testData = testDataInput;
  		scope.startStatus = true;
  		scope.$digest();
	});

  }])


.directive('indent', function () {

return {
	restrict: 'E',
	scope: {
  		inputFile: '@',
  		width: '=',
  		height: '=',
  		parentTag: '@'
	},
	link: function (scope, element, attrs) {
		var margin = {top: 30, right: 20, bottom: 30, left: 20},
	    width = 960 - margin.left - margin.right,
	    barHeight = 20,
	    barWidth = width * .8;

		var i = 0,
		    duration = 400,
		    root;

		var tree = d3.layout.tree()
		    .nodeSize([0, 20]);

		var diagonal = d3.svg.diagonal()
		    .projection(function(d) { return [d.y, d.x]; });

		var parent = (scope.parentTag != undefined)? scope.parentTag : "indentBox";
		var svg = d3.select(/*"IndentBox"*/parent).append("svg")
		    .attr("width", width + margin.left + margin.right)
		  .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// var fileName = (inputFile != '')
		d3.json(/*"rule.json"*/scope.inputFile, function(error, flare) {
		  if (error) throw error;

		  flare.x0 = 0;
		  flare.y0 = 0;
		  function collapse(d) {
		        if (d.children) {
		          d._children = d.children;
		          d._children.forEach(collapse);
		          d.children = null;
		        }
		      }
		  flare.children.forEach(collapse);
		  update(root = flare);

		});

		function update(source) {

		  // Compute the flattened node list. TODO use d3.layout.hierarchy.
		  var nodes = tree.nodes(root);

		  var height = Math.max(500, nodes.length * barHeight + margin.top + margin.bottom);

		  d3.select("svg").transition()
		      .duration(duration)
		      .attr("height", height);

		  d3.select(self.frameElement).transition()
		      .duration(duration)
		      .style("height", height + "px");

		  // Compute the "layout".
		  nodes.forEach(function(n, i) {
		    n.x = i * barHeight;
		  });

		  // Update the nodes…
		  var node = svg.selectAll("g.node")
		      .data(nodes, function(d) { return d.id || (d.id = ++i); });

		  var nodeEnter = node.enter().append("g")
		      .attr("class", "node")
		      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
		      .style("opacity", 1e-6);

		  // Enter any new nodes at the parent's previous position.
		  nodeEnter.append("rect")
		      .attr("y", -barHeight / 2)
		      .attr("height", barHeight)
		      .attr("width", barWidth)
		      .style("fill", color)
		      .on("click", click);

		  nodeEnter.append("text")
		      .attr("dy", 3.5)
		      .attr("dx", 5.5)
		      .text(function(d) { return d.name; });

		  // Transition nodes to their new position.
		  nodeEnter.transition()
		      .duration(duration)
		      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
		      .style("opacity", 1);

		  node.transition()
		      .duration(duration)
		      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
		      .style("opacity", 1)
		    .select("rect")
		      .style("fill", color);

		  // Transition exiting nodes to the parent's new position.
		  node.exit().transition()
		      .duration(duration)
		      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
		      .style("opacity", 1e-6)
		      .remove();

		  // Update the links…
		  var link = svg.selectAll("path.link")
		      .data(tree.links(nodes), function(d) { return d.target.id; });

		  // Enter any new links at the parent's previous position.
		  link.enter().insert("path", "g")
		      .attr("class", "link")
		      .attr("d", function(d) {
		        var o = {x: source.x0, y: source.y0};
		        return diagonal({source: o, target: o});
		      })
		    .transition()
		      .duration(duration)
		      .attr("d", diagonal);

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
		function click(d) {
		  scope.$emit('changeIndentNode', d);
		  if (d.children) {
		    d._children = d.children;
		    d.children = null;
		  } else {
		    d.children = d._children;
		    d._children = null;
		  }
		  update(d);
		}

		function color(d) {
		  return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
		}
	}
}
});