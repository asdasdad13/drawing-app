function StampTool(){
	this.icon = "assets/stamp.png";
	this.name = "Stamp";
	this.size = 30;
	var previousMouseX = -1; //-1 is the null value
	var previousMouseY = -1;
	var drawing = false;
	var self = this;

	this.draw = function(){
		if(mouseIsPressed && checkWithinCanvas()){ //if mouse is pressed
			if(keyIsPressed && key=='') {
				if(previousMouseX == -1){
					previousMouseX = mouseX;
					previousMouseY = mouseY;
					drawing = true;
					loadPixels(); //save the current pixel array
				}
				else {
					updatePixels();
					//draw the line
					if (abs(mouseX - previousMouseX) > abs(mouseY - previousMouseY)) { //x axis changes more
						var spacing = ceil((previousMouseX - mouseX)/this.size); 
						this.renderAlternate(previousMouseX,mouseX,(previousMouseX - mouseX)/spacing,(previousMouseY - mouseY)/spacing);
					}
					else { //y axis changes more
						var spacing = ceil((previousMouseY - mouseY)/this.size); 
						this.renderAlternate(previousMouseY,mouseY,(previousMouseX - mouseX)/spacing,(previousMouseY - mouseY)/spacing);
					}
					
				}
			}
			else if(drawing){ //if a line is in the process of being drawn, and mouse is no longer pressed
				drawing = false; //reset all values to prevent next line from connecting
				previousMouseX = -1;
				previousMouseY = -1;
			}
			else image(sparkles,mouseX-this.size/2,mouseY-this.size/2,this.size,this.size);
		}
		this.checkSizeChanged();
	};

	this.renderAlternate = function(prevMouseCoord,currMouseCoord,xDiff,yDiff) {
		if (prevMouseCoord < currMouseCoord) { //for loop is increasing
			for (var i = 0; i < ceil((currMouseCoord-prevMouseCoord)/this.size); i++) {//number of sample spots
				image(sparkles,previousMouseX+i*xDiff, previousMouseY+i*yDiff,this.size,this.size);
			}
		}
		else { //for loop is decrasing
			for (var i = 0; i > ceil((currMouseCoord-prevMouseCoord)/this.size); i--) {//number of sample spots
				image(sparkles,previousMouseX+i*xDiff, previousMouseY+i*yDiff,this.size,this.size);
			}
		}
	}

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
