function StampTool(){
	this.icon = "assets/stamp.png";
	this.name = "Stamp";
	this.size = 30;
	var startMouseX = -1; //-1 is the null value
	var startMouseY = -1;

	this.draw = function(){
		if(mouseIsPressed && checkWithinCanvas()){ //if mouse is pressed
			console.log(0)
			image(sparkles,mouseX-this.size/2,mouseY-this.size/2,this.size,this.size);
		}
	};
	
	this.unselectTool = function() {
		select("#tool-size").remove();
	}

	this.populateOptions = function() {
		//add a spacing option

		//add fixed width option (mouse velocity does not affect frequency of stamp image)

		//add html element for brush size slider
		var d = createDiv();
		d.id('tool-size');
		d.style('display','inline-block')
		d.parent('#tool-options');

		toolSizeSlider = createSlider(1,100,this.size);
		toolSizeSlider.parent(d);

		toolSizeInput = createInput(this.size);
		toolSizeInput.style('width','3rem');
		toolSizeInput.attribute('type', 'number')
		toolSizeInput.parent('tool-size');
	};
}
