
function SprayCanTool(){
    this.name = "sprayCanTool";
    this.icon = "assets/sprayCan.png";
    this.size = 3;
	var self = this;
	this.draw = function(){
        strokeWeight(this.size/50);
        //if the mouse is pressed paint on the canvas
        if(mouseIsPressed && checkWithinCanvas()){
            for(var i = 0; i < this.size/2; i++){
                point(random(mouseX-this.size, mouseX + this.size), 
                random(mouseY-this.size, mouseY+this.size));
            }
        }

        if (keyIsPressed){
			if (keyCode==91 && this.size>1) { //decrease brush size with '['
				this.size--;
				toolSizeSlider.value(this.size); //update slider and input field values
				toolSizeInput.value(this.size);
			}
			if (keyCode==93 && this.size<100) { //increase brush size with ']'
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

	this.mirrorDraw = function(previousMouseX, previousMouseY, mouseX, mouseY) {
		for(var i = 0; i < this.points; i++){
			point(random(mouseX-this.size, mouseX + this.size), 
			random(mouseY-this.size, mouseY+this.size));
		}
	}
	
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
};