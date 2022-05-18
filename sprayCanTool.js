
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
					

					if (abs(mouseX - previousMouseX) > abs(mouseY - previousMouseY)) { //x axis changes more
						var x = ceil((previousMouseX - mouseX)/this.size);
						var xDiff = (previousMouseX - mouseX)/x
						var yDiff = (previousMouseY - mouseY)/x;
						if (mouseX > previousMouseX) { //for loop is increasing
							for (var i = 0; i < ceil((mouseX-previousMouseX)/this.size); i++) {//number of sample spots
								ellipse(previousMouseX+i*xDiff, previousMouseY+i*yDiff,40);
							}
						}
						else { //for loop is decreasing
							for (var i = 0; i > ceil((mouseX-previousMouseX-this.size*2)/this.size); i--) {//number of sample spots
								ellipse(previousMouseX+i*xDiff, previousMouseY+i*yDiff,40);
							}
						}
					} else { //y axis changes more
						var x = ceil((previousMouseY - mouseY)/this.size);
						var xDiff = (previousMouseX - mouseX)/x
						var yDiff = (previousMouseY - mouseY)/x;
						if (mouseY > previousMouseY) { //for loop is increasing
							for (var i = 0; i < ceil((mouseY-previousMouseY)/this.size); i++) {//number of sample spots
								ellipse(previousMouseX+i*xDiff, previousMouseY+i*yDiff,40);
							}
						}
						else { //for loop is decreasing
							for (var i = 0; i > ceil((mouseY-previousMouseY-this.size*2)/this.size); i--) {//number of sample spots
								ellipse(previousMouseX+i*xDiff, previousMouseY+i*yDiff,40);
							}
						}
					}
					// for(var i = 0; i < ceil(abs(previousMouseX - mouseX)/this.size); i++) {
					// 	var a = abs(previousMouseX - mouseX);
					// 	var b = abs(previousMouseY - mouseY);
					// 	point(random(a-this.size, a+this.size), random(b-this.size, b+this.size));
					// }
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