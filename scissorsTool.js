function ScissorsTool(){
    this.name = "scissorsTool";
    this.icon = "assets/scissors.png";
    var selectArea = {x: -1, y: -1, w: 0, h: 0};
    var selectedPixels;
    this.selectMode = 0;
	var self = this;
	var drawing = false;

	this.draw = function()
    {
        noStroke();
        fill(0,70,100,50);
        if(mouseIsPressed && checkWithinCanvas())
        {
            if (this.selectMode == 1) this.pasteImage();
            else { //selecting mode
                if (!drawing) {
                    selectArea.x = -1;
                    selectArea.y = -1;
                }
                if (keyIsPressed && key=='') { //for rendering a square selection box and using that value for selection coordinates
                    a = dist(selectArea.x, selectArea.y, mouseX, mouseY)/Math.sqrt(2); //formula for length of side of square
                    if (selectArea.x<mouseX) var xOffset = a; //square will be produced leftwards of start point
                    else var xOffset = -a; //right
                    if (selectArea.y<mouseY) var yOffset = a; //square will be produced above start point
                    else var yOffset = -a; //below

                    selectArea.w = selectArea.h = abs(a);
                } else {
                    selectArea.w = abs(mouseX - selectArea.x);
                    selectArea.h = abs(mouseY - selectArea.y);
                }
                if (selectArea.x == -1) {
                    selectArea.x = mouseX;
                    selectArea.y = mouseY;
                    drawing = true;
                    loadPixels();
                } else if (drawing) {
                    updatePixels();
                    if (keyIsPressed && key=='') {rect(selectArea.x, selectArea.y, xOffset, yOffset); //with shift key down, render a square
                    }
                    else rect(selectArea.x, selectArea.y, mouseX - selectArea.x, mouseY - selectArea.y); //render a free rectangle
                }
            }
        }
        else if (drawing) { //what happens right after mouse is released
            updatePixels();
            loadPixels();
            drawing = false;
            select('#cutButton').removeAttribute('disabled');
            select('#cutButton').style('color','#FFF');
        }
    }

    this.pasteImage = function() { //paste can be done by clicking button or Ctrl+X, which is controlled at sketch.js
        image(selectedPixels,mouseX - selectedPixels.width/2, mouseY - selectedPixels.height/2); //pasting mode, just paste and avoid selection mode
        loadPixels();
    }
	
	this.unselectTool = function() {
        select('#cutButton').remove();
        select('#pasteButton').remove();
        this.selectMode = 0;
        selectArea = {x: -1, y: -1, w: 0, h: 0};
	}

    this.populateOptions = function() {
		//add html element for brush size slider
		var c = createButton('Cut selection');
		c.id('cutButton');
		c.parent('#tool-options');
        c.attribute('disabled','disabled');
        c.style('color','grey');

        var p = createButton('Paste selection');
		p.id('pasteButton');
		p.parent('#tool-options');

        if (selectArea.x==-1) { //user has not selected before, paste is unavailable
            p.attribute('disabled','disabled');
            p.style('color','grey');
        }

        c.mousePressed(function(){
            if (selectArea.w!=0) {
                updatePixels();
                console.log('Cut!');
                selectedPixels = get(selectArea.x,selectArea.y,abs(selectArea.w),abs(selectArea.h));
                p.removeAttribute('disabled');
                p.style('color','#FFF');
            }
        })

        p.mousePressed(function(){
            if (self.selectMode==0) {
                self.selectMode++;
                this.html('End paste');
                c.attribute('disabled','disabled');
                c.style('color','grey');
            } else {
                self.selectMode--;
                this.html('Paste selection');
            }
        })
	};
};