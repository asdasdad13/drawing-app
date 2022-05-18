
function SprayCanTool(){
    this.name = "sprayCanTool";
    this.icon = "assets/sprayCan.png";
    this.size = 50;
	var self = this;
	var previousMouseX = -1;
	var previousMouseY = -1;
	var drawing = false;

	this.draw = function(){
        strokeWeight(this.size/25);
		if (keyIsPressed && key=='') { //shift key down; draw straight line
			if(mouseIsPressed && checkWithinCanvas()){
				//if it's the start of drawing a new line
				if(previousMouseX == -1){
					previousMouseX = mouseX;
					previousMouseY = mouseY;
					drawing = true;
					loadPixels(); //save the current pixel array
				}
	
				else{
					updatePixels();
					//draw the line
					for (j=0;j<this.size;j++) {
						if (abs(mouseX - previousMouseX) > abs(mouseY - previousMouseY)) { //x axis changes more
							var x = ceil((previousMouseX - mouseX)/this.size);
							var xDiff = (previousMouseX - mouseX)/x
							var yDiff = (previousMouseY - mouseY)/x;
							this.renderAlternate(previousMouseX,mouseX,xDiff,yDiff);
						}
						else { //y axis changes more
							var x = ceil((previousMouseY - mouseY)/this.size);
							var xDiff = (previousMouseX - mouseX)/x
							var yDiff = (previousMouseY - mouseY)/x;
							this.renderAlternate(previousMouseY,mouseY,xDiff,yDiff);
						}
					}
				}
	
			}
	
			else if(drawing){
				//reset the drawing bool and start locations
				drawing = false;
				previousMouseX = -1;
				previousMouseY = -1;
			}
		}
        //if the mouse is pressed paint on the canvas
        else if(mouseIsPressed && checkWithinCanvas()){
            for(var i = 0; i < this.size/2; i++){
                point(random(mouseX-this.size, mouseX + this.size), random(mouseY-this.size, mouseY+this.size));
            }
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

		toolSizeSlider.changed(function() { //if size was adjusted using slider, update values of input field and tool size
			toolSizeInput.value(toolSizeSlider.value());
			self.size = toolSizeSlider.value();
		})
		toolSizeInput.changed(function() { //if size was adjusted using input field, update values of slider and tool size
			toolSizeSlider.value(Number(toolSizeInput.value()));
			self.size = Number(toolSizeInput.value());
		})
	};

	this.renderAlternate = function(prevMouseCoord,currMouseCoord,xDiff,yDiff) {
		if (prevMouseCoord < currMouseCoord) { //for loop is increasing
			for (var i = 0; i < ceil((currMouseCoord-prevMouseCoord)/this.size); i++) {//number of sample spots
				point(random(previousMouseX+i*xDiff-this.size, previousMouseX+i*xDiff+this.size), random(previousMouseY+i*yDiff-this.size, previousMouseY+i*yDiff+this.size));
			}
		}
		else { //for loop is decrasing
			for (var i = 0; i > ceil((currMouseCoord-prevMouseCoord)/this.size); i--) {//number of sample spots
				point(random(previousMouseX+i*xDiff-this.size, previousMouseX+i*xDiff+this.size), random(previousMouseY+i*yDiff-this.size, previousMouseY+i*yDiff+this.size));
			}
		}
	}
	
	this.unselectTool = function() {
		select("#tool-size").remove();
	}

	this.populateOptions = function() {
		//add spacing option
		
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
};