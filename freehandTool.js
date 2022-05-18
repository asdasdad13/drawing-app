function FreehandTool(){
	//set an icon and a name for the object
	this.icon = "assets/freehand.png";
	this.name = "freehand";
	this.size = 3;

	//to smoothly draw we'll draw a line from the previous mouse location
	//to the current mouse location. The following values store
	//the locations from the last frame. They are -1 to start with because
	//we haven't started drawing yet.
	var previousMouseX = -1;
	var previousMouseY = -1;
	var drawing = false;

	this.draw = function(){
		strokeWeight(this.size);
		//if the mouse is pressed
		if(mouseIsPressed && checkWithinCanvas()){
			//check if they previousX and Y are -1. set them to the current ouse X and Y if they are.
			if (previousMouseX == -1){
				previousMouseX = mouseX;
				previousMouseY = mouseY;
				if(keyIsPressed && key=='') {
					drawing = true;
					//save the current pixel Array
					loadPixels();
				}
			}
			//if we already have values for previousX and Y we can draw a line from 
			//there to the current mouse location
			else{
				if(keyIsPressed && key=='') {
					//update the screen with the saved pixels to hide any previous line between mouse pressed and released
					updatePixels();
					//draw the line
					line(previousMouseX, previousMouseY, mouseX, mouseY);
				} else {
					line(previousMouseX, previousMouseY, mouseX, mouseY);
					previousMouseX = mouseX;
					previousMouseY = mouseY;
				}
			}
		}
		//if the user has released the mouse we want to set the previousMouse values back to -1.
		else{
			previousMouseX = -1;
			previousMouseY = -1;
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
	}
}