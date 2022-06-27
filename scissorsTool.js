
function ScissorsTool(){
    this.name = "scissorsTool";
    this.icon = "assets/scissors.png";
    var selectArea = {x: -1, y: -1, w: 100, h: 100};
    var selectedPixels;
    this.selectMode = 0;
	var self = this;
	var drawing = false;

	this.draw = function(){
        noStroke();
        fill(0,70,100);

        if(mouseIsPressed && checkWithinCanvas()){
            if (this.selectMode == 1) this.pasteImage();
            else { //selecting mode
                selectArea.w = mouseX - selectArea.x;
                selectArea.h = mouseY - selectArea.y;
                if(selectArea.x == -1){
                    selectArea.x = mouseX;
                    selectArea.y = mouseY;
                    drawing = true;
                    loadPixels();
                }
                else { //for rendering the line, mouse released or not
                    if (keyIsPressed && key=='') rect(selectArea.x, selectArea.y, selectArea.w, selectArea.w);
                    else rect(selectArea.x, selectArea.y, selectArea.w, selectArea.h);
                }
            }
        }
		
		else if(drawing){
			//reset the drawing bool and start locations
            drawing = false;
            selectArea.x = -1;
            selectArea.y = -1;
		}
    }

    this.pasteImage = function() { //paste can be done by clicking button or Ctrl+X, which is controlled at sketch.js
        console.log(selectedPixels)
        image(selectedPixels,(mouseX + selectedPixels.width)/2,(mouseY + selectedPixels.height)/2); //pasting mode, just paste and avoid selection mode
        loadPixels();
    }
	
	this.unselectTool = function() {
        select('#cutButton').remove();
        select('#pasteButton').remove();
        this.selectMode = 0;
        selectArea = {x: -1, y: -1, w: 100, h: 100};
	}

    this.populateOptions = function() {
		//add html element for brush size slider
		var c = createButton('Cut selection');
		c.id('cutButton');
		c.parent('#tool-options');

        var p = createButton('Paste selection');
		p.id('pasteButton');
		p.parent('#tool-options');

        c.mousePressed(function(){
            updatePixels();
            console.log('Cut!');
            selectedPixels = get(selectArea.x,selectArea.y,selectArea.w,selectArea.h);
        })
        p.mousePressed(function(){
            self.selectMode = 1;
            selectArea = {x: -1, y: -1, w: 100, h: 100};
        })
	};
};