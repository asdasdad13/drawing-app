
function SprayCanTool(){
    this.name = "sprayCanTool";
    this.icon = "assets/sprayCan.png";
    this.size = 50;
	this.density = 20;
	var self = this;
	var previousMouseX = -1;
	var previousMouseY = -1;
	var drawing = false;

	this.draw = function(){
        strokeWeight(this.size/25);
        //if the mouse is pressed paint on the canvas
        if(mouseIsPressed && checkWithinCanvas()){
			if (keyIsPressed && key=='') { //shift key down; draw straight line
				//if it's the start of drawing a new line
				if(previousMouseX == -1){
					previousMouseX = mouseX;
					previousMouseY = mouseY;
					drawing = true;
					loadPixels(); //save the current pixel array
				}
				else {
					updatePixels();
					//draw the line
					for (j=0;j<this.density*8;j++) { //controls amount of particles
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
			}
			else {
				for(var i = 0; i < this.density*8; i++){ //shift key up, draw freehand
					point(random(mouseX-this.size, mouseX + this.size), random(mouseY-this.size, mouseY+this.size));
				}
			}
        }
		
		else if(drawing){
			//reset the drawing bool and start locations
			drawing = false;
			previousMouseX = -1;
			previousMouseY = -1;
		}
		this.checkSizeChanged();
		this.checkDensityChanged();

	};

	this.renderAlternate = function(prevMouseCoord,currMouseCoord,xDiff,yDiff) {
		if (prevMouseCoord < currMouseCoord) { //for loop is increasing
			console.log(ceil((currMouseCoord-prevMouseCoord)/this.size))
			for (var i = 0; i < ceil((currMouseCoord-prevMouseCoord)/this.size); i++) {//number of sample spots
				point(random(previousMouseX+i*xDiff-this.size, previousMouseX+i*xDiff+this.size), random(previousMouseY+i*yDiff-this.size, previousMouseY+i*yDiff+this.size));
			}
		} else { //for loop is decreasing
			for (var i = 0; i > ceil((currMouseCoord-prevMouseCoord-this.size*2)/this.size); i--) {//number of sample spots
				point(random(previousMouseX+i*xDiff-this.size, previousMouseX+i*xDiff+this.size), random(previousMouseY+i*yDiff-this.size, previousMouseY+i*yDiff+this.size));
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

	this.checkDensityChanged = function() {
		if (toolDensityInput.value()>50) toolDensityInput.value(50); //min and max limits for toolSizeInput
		if (toolDensityInput.value()<1) toolDensityInput.value(1);

		toolDensitySlider.changed(function() { //if size was adjusted using slider, update values of input field and tool size
			toolDensityInput.value(toolDensitySlider.value());
			self.density = toolDensitySlider.value();
		})
		toolDensityInput.changed(function() { //if size was adjusted using input field, update values of slider and tool size
			toolDensitySlider.value(Number(toolDensityInput.value()));
			self.density = Number(toolDensityInput.value());
		})
	}

	this.unselectTool = function() {
		select("#tool-size").remove();
		select("#tool-density").remove();
	}

	this.populateOptions = function() {
		//add Density div. Includes a checkbox asking for Fixed density? and a density slider.
		var a = createDiv();
		a.id('tool-density');
		a.parent('#tool-options');

		//add a density option
		var b = createDiv();
		b.html('Density: ')
		b.parent('#tool-density');

		toolDensitySlider = createSlider(1,50,this.density);
		toolDensitySlider.parent(b);

		toolDensityInput = createInput(this.density);
		toolDensityInput.parent(b);
		toolDensityInput.attribute('type', 'number')
		toolDensityInput.style('width','3rem');

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
};