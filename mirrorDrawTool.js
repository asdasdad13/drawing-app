function MirrorDrawTool() {
	this.name = "mirrorDraw";
	this.icon = "assets/mirrorDraw.png";
	this.size = 3;
	var self = this;

	//which axis is being mirrored (x or y) x is default
	this.axis = "x";
	//line of symmetry is halfway across the screen
	this.lineOfSymmetry = width / 2;

	//where was the mouse on the last time draw was called.
	//set it to -1 to begin with
	var previousMouseX = -1;
	var previousMouseY = -1;

	//mouse coordinates for the other side of the Line of symmetry.
	var previousOppositeMouseX = -1;
	var previousOppositeMouseY = -1;

	this.draw = function() {
		strokeWeight(this.size);
		//do the drawing if the mouse is pressed
		if (mouseIsPressed && checkWithinCanvas()) {
			//if the previous values are -1 set them to the current mouse location and mirrored positions
			if (previousMouseX == -1) {
				previousMouseX = mouseX;
				previousMouseY = mouseY;
				previousOppositeMouseX = this.calculateOpposite(mouseX, "x");
				previousOppositeMouseY = this.calculateOpposite(mouseY, "y");
				if(keyIsPressed && key=='') loadPixels(); //save the current pixel Array
			}

			//if there are values in the previous locations
			//draw a line between them and the current positions
			else {
				var oX = this.calculateOpposite(mouseX, "x");
				var oY = this.calculateOpposite(mouseY, "y");
				if(keyIsPressed && key=='') {
					updatePixels();
					line(previousMouseX, previousMouseY, mouseX, mouseY);
					line(previousOppositeMouseX, previousOppositeMouseY, oX, oY);
				} else {
					line(previousMouseX, previousMouseY, mouseX, mouseY);
	
					//these are for the mirrored drawing the other side of the line of symmetry
					line(previousOppositeMouseX, previousOppositeMouseY, oX, oY);
					previousOppositeMouseX = oX;
					previousOppositeMouseY = oY;
					previousMouseX = mouseX;
					previousMouseY = mouseY;
				}
			}
		}
		//if the mouse isn't pressed reset the previous values to -1
		else {
			previousMouseX = -1;
			previousMouseY = -1;

			previousOppositeMouseX = -1;
			previousOppositeMouseY = -1;
		}
		this.checkSizeChanged();
	};

	/*calculate an opposite coordinate the other side of the
	 *symmetry line.
	 *@param n number: location for either x or y coordinate
	 *@param a [x,y]: the axis of the coordinate (x or y)
	 *@return number: the opposite coordinate
	 */
	this.calculateOpposite = function(n, a) {
		//if the axis isn't the one being mirrored return the same value
		if (a != this.axis) {
			return n;
		}

		//if n is less than the line of symmetry return a coorindate that is far greater than the line of symmetry by the distance from n to that line.
		if (n < this.lineOfSymmetry) {
			return this.lineOfSymmetry + (this.lineOfSymmetry - n);
		}

		//otherwise a coordinate that is smaller than the line of symmetry by the distance between it and n.
		else {
			return this.lineOfSymmetry - (n - this.lineOfSymmetry);
		}
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

	//when the tool is deselected update the pixels to just show the drawing and hide the line of symmetry.
	this.unselectTool = function() {
		select("#tool-size").remove();
		select('#lineOfSymmetry').style('display', 'none');
	};

	this.adjustOrientation = function() {
		if (this.axis == 'x') { //switch to vert symmetry (top and bottom)
			this.axis = 'y';
			this.lineOfSymmetry = height / 2;
			var i = document.querySelector('#mirrorDrawsideBarItem img');
			i.style.transform = 'rotate(90deg)';
		}
		else {
			this.axis = 'x'; //switch to hori symmetry
			this.lineOfSymmetry = width / 2;
			var i = document.querySelector('#mirrorDrawsideBarItem img');
			i.style.transform = 'rotate(0deg)';
		}
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

	this.adjustLOS = function() { //adjust line of symmetry as seen on the canvas
		var los = select('#lineOfSymmetry');
		var c = select('#content');
		if (this.axis == 'x') { //when symmetry is hori
			los.style('border-bottom', '0');
			los.style('border-right', '0.2vw dashed black');
			los.style('width', '0'); 
			los.style('height', c.size().height +'px'); //adjust line of symmetry as seen on the canvas
			los.style('top', 'initial');
			los.style('left', c.size().width/2 + select('#sidebar').size().width + 'px');
		} else { //when symmetry is vert
			los.style('border-right', '0');
			los.style('border-bottom', '0.2vw dashed black');
			los.style('height', '0');
			los.style('width', c.size().width +'px');
			los.style('top', c.size().height/2 + select('#top-menu').size().height + 'px');
			los.style('left', select('#sidebar').size().width + 'px');
		}
	}
}