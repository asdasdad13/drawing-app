function EllipseTool(){
	this.icon = "assets/ellipse.png";
	this.name = "Ellipse";
	this.size = 3;

	var startMouseX = -1; //-1 is the null value
	var startMouseY = -1;
	var self = this;

	this.draw = function(){
		strokeWeight(this.size);
		if(mouseIsPressed && checkWithinCanvas()){ //if mouse is pressed
			if(startMouseX == -1){ //startMouseX is changed from -1 to mouseX value for start of new line
				startMouseX = mouseX;
				startMouseY = mouseY;
				loadPixels(); //system funtcion that loads canvas image to [pixels] array
			}

			else{ //for rendering the line, mouse released or not
				updatePixels(); //system function that updates canvas image with contents of [pixels] array
				if (keyIsPressed && key=='') ellipse(startMouseX, startMouseY, (mouseX-startMouseX)*2); //shift key down; draw straight line
				else ellipse(startMouseX, startMouseY, (mouseX-startMouseX)*2, (mouseY-startMouseY)*2); //a line is rendered from starting point to current mouse position, mouse released or not
			}

		}

		else { //if a line is in the process of being drawn, and mouse is no longer pressed
			startMouseX = -1;
			startMouseY = -1;
		}
		this.checkSizeChanged();
	};
	
	this.checkSizeChanged = function() {
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

		toolSizeSlider.changed(function() { //if size was adjusted using slider, update values of input field and tool size
			toolSizeInput.value(toolSizeSlider.value());
			self.size = toolSizeSlider.value();
		})
		toolSizeInput.changed(function() { //if size was adjusted using input field, update values of slider and tool size
			toolSizeSlider.value(Number(toolSizeInput.value()));
			self.size = Number(toolSizeInput.value());
		})
	}

	this.unselectTool = function() {
		select("#tool-size").remove();
	}

	this.populateOptions = function() {
		//add html element for brush size slider
		var d = createDiv();
		d.id('tool-size');
		d.html('Tool radius: ')
		d.parent('#tool-options');

		toolSizeSlider = createSlider(1,100,this.size);
		toolSizeSlider.parent(d);

		toolSizeInput = createInput(this.size);
		toolSizeInput.style('width','3rem');
		toolSizeInput.attribute('type', 'number')
		toolSizeInput.parent('tool-size');
	};
}
