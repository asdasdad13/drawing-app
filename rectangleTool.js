function RectangleTool(){
	this.icon = "assets/rectangle.png";
	this.name = "Rectangle";
	this.size = 3;

	var startMouseX = -1; //-1 is the null value
	var startMouseY = -1;
	var drawing = false;

	this.draw = function(){
		strokeWeight(this.size);
		if(mouseIsPressed && checkWithinCanvas()){ //if mouse is pressed
			if(startMouseX == -1){ //startMouseX is changed from -1 to mouseX value for start of new line
				startMouseX = mouseX;
				startMouseY = mouseY;
				drawing = true;
				loadPixels(); //system funtcion that loads canvas image to [pixels] array
			}

			else{ //for rendering the line, mouse released or not
				updatePixels(); //system function that updates canvas image with contents of [pixels] array
				if (keyIsPressed && key=='') rect(startMouseX, startMouseY, mouseX-startMouseX, mouseX-startMouseX); //shift key down; draw straight line
				else rect(startMouseX, startMouseY, mouseX-startMouseX, mouseY-startMouseY); //a line is rendered from starting point to current mouse position, mouse released or not
			}

		}

		else if(drawing){ //if a line is in the process of being drawn, and mouse is no longer pressed
			drawing = false; //reset all values to prevent next line from connecting
			startMouseX = -1;
			startMouseY = -1;
		}

		if (keyIsPressed){
			if (key=='[' && this.size>1) { //decrease brush size with '['
				this.size--;
				toolSizeSlider.value(this.size); //update slider and input field values
				toolSizeInput.value(this.size);
			}
			if (key==']' && this.size<100) { //increase brush size with ']'
				this.size++;
				toolSizeSlider.value(this.size); //update slider and input field values
				toolSizeInput.value(this.size);
			}
		}

		if (toolSizeInput.value()>100) toolSizeInput.value(100); //min and max limits for toolSizeInput
		if (toolSizeInput.value()<1) toolSizeInput.value(1);

		var self = this;
		toolSizeSlider.changed(function() { //if size was adjusted using slider, update values of input field and tool size
			toolSizeInput.value(toolSizeSlider.value());
			self.size = toolSizeSlider.value();
		})
		toolSizeInput.changed(function() { //if size was adjusted using input field, update values of slider and tool size
			toolSizeSlider.value(toolSizeInput.value());
			self.size = toolSizeInput.value();
		})
	};
	
	this.unselectTool = function() {
		select("#tool-size").remove();
	}

	this.populateOptions = function() {
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
