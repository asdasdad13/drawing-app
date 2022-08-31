function StampTool(){
	this.icon = "assets/stamp.png";
	this.name = "Stamp";
	this.size = 30;
	this.spacing = 30;
	this.fixedSpacing = true;

	var startMouseX = -1; //-1 is the null value
	var startMouseY = -1;
	var prevMouseX = -1;
	var prevMouseY = -1;
	var self = this;

	this.draw = function(){
		if(mouseIsPressed && checkWithinCanvas()){ //if mouse is pressed
			if(keyIsPressed && key=='') {
				if(startMouseX == -1){
					startMouseX = mouseX;
					startMouseY = mouseY;
					loadPixels(); //save the current pixel array
				}
				else {
					updatePixels();
					//draw the line
					if (abs(mouseX - startMouseX) > abs(mouseY - startMouseY)) { //x axis changes more
						var spacing = ceil((startMouseX - mouseX)/this.size); 
						this.renderAlternate(startMouseX,mouseX,(startMouseX - mouseX)/spacing,(startMouseY - mouseY)/spacing);
					}
					else { //y axis changes more
						var spacing = ceil((startMouseY - mouseY)/this.size); 
						this.renderAlternate(startMouseY,mouseY,(startMouseX - mouseX)/spacing,(startMouseY - mouseY)/spacing);
					}
				}
			}
			else {
				if (this.fixedSpacing) { //apply fixed spacing
					if (dist(mouseX,mouseY,prevMouseX,prevMouseY) >= this.spacing+this.size/2) { //ensure spacing between stamped images
						image(sparkles,mouseX-this.size/2,mouseY-this.size/2,this.size,this.size);
						prevMouseX = mouseX;
						prevMouseY = mouseY;
					}
				}
				else { //no fixed spacing
					image(sparkles,mouseX-this.size/2,mouseY-this.size/2,this.size,this.size);
				}
			}
		}
		else {
			startMouseX = -1;
			startMouseY = -1;
			prevMouseX = -1; //ensures that individual clicks can paint the image at a distance less than the fixed spacing specified.
			prevMouseY = -1;
		}
		this.checkSizeChanged();
		this.checkSpacingChanged();
	};

	this.renderAlternate = function(prevMouseCoord,currMouseCoord,xDiff,yDiff) {
		if (prevMouseCoord < currMouseCoord) { //for loop is increasing
			for (var i = 0; i < ceil((currMouseCoord-prevMouseCoord)/this.size); i++) {//number of sample spots
				image(sparkles,startMouseX+i*xDiff-this.size/2, startMouseY+i*yDiff-this.size/2,this.size,this.size);
			}
		}
		else { //for loop is decrasing
			for (var i = 0; i > ceil((currMouseCoord-prevMouseCoord-this.size*2)/this.size); i--) {//number of sample spots
				image(sparkles,startMouseX+i*xDiff-this.size/2, startMouseY+i*yDiff-this.size/2,this.size,this.size);
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
			if (key==']' && self.size<100) { //increase brush size with ']'
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

	this.checkSpacingChanged = function() {
        if (keyIsPressed){
			if (key=='[' && this.spacing>1) { //decrease brush size with '['
				this.spacing--;
				toolSpacingSlider.value(this.spacing); //update slider and input field values
				toolSpacingInput.value(this.spacing);
			}
			if (key==']' && this.size<100) { //increase brush size with ']'
				this.spacing++;
				toolSpacingSlider.value(this.spacing); //update slider and input field values
				toolSpacingInput.value(this.spacing);
			}
		}

		if (toolSpacingInput.value()>100) toolSpacingInput.value(100); //min and max limits for toolSizeInput
		if (toolSpacingInput.value()<0) toolSpacingInput.value(0);

		toolSpacingSlider.changed(function() { //if size was adjusted using slider, update values of input field and tool size
			toolSpacingInput.value(toolSpacingSlider.value());
			self.spacing = toolSpacingSlider.value();
		})
		toolSpacingInput.changed(function() { //if size was adjusted using input field, update values of slider and tool size
			toolSpacingSlider.value(Number(toolSpacingInput.value()));
			self.spacing = Number(toolSpacingInput.value());
		})
	}
	
	this.unselectTool = function() {
		select("#tool-size").remove();
		select("#tool-spacing").remove();
	}

	this.populateOptions = function() {
		//add Spacing div. Includes a checkbox asking for Fixed spacing? and a spacing slider.
		var a = createDiv();
		a.id('tool-spacing');
		a.parent('#tool-options');

		//add checkbox for Fixed spacing?
		var fixedSpacingCheck = createCheckbox('Fixed spacing?',true);
		fixedSpacingCheck.parent('#tool-spacing');

		//add a spacing option
		var b = createDiv();
		b.html('Spacing: ')
		b.parent('#tool-spacing');

		toolSpacingSlider = createSlider(0,100,this.spacing);
		toolSpacingSlider.parent(b);

		toolSpacingInput = createInput(this.spacing);
		toolSpacingInput.parent(b);
		toolSpacingInput.attribute('type', 'number')
		toolSpacingInput.style('width','3rem');

		//add html element for brush size slider
		var d = createDiv();
		d.id('tool-size');
		d.html('Tool radius: ')
		d.parent('#tool-options');

		toolSizeSlider = createSlider(1,100,this.size);
		toolSizeSlider.parent(d);

		toolSizeInput = createInput(this.size);
		toolSizeInput.attribute('type', 'number')
		toolSizeInput.parent('tool-size');
		toolSizeInput.style('width','3rem');
		
		fixedSpacingCheck.changed(function() { //disable Fixed spacing settings if it has been turned off
			if (this.checked()) {
				self.fixedSpacing = true;
				toolSpacingSlider.removeAttribute('disabled');
				toolSpacingInput.removeAttribute('disabled');
				toolSpacingInput.attribute('color','#FFF');
				b.style('color','#FFF');
			}
			else {
				self.fixedSpacing = false;
				toolSpacingSlider.attribute('disabled','disabled');
				toolSpacingInput.attribute('disabled','disabled');
				toolSpacingInput.attribute('color','grey');
				b.style('color','grey')
			}
		})
	};
}
