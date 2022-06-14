function EditableShape() {
    this.icon = 'assets/editableShape.png';
    this.name = 'editableShape';

    var editButton;
    var finishButton;

    //true - edit mode, false - drawing mode
    var editMode = false;
    //to keep the current drawn mouseX and mouseY
    var currentShape = []; 
    this.draw = function() {
        updatePixels();
        if (checkWithinCanvas(canvas) && mouseIsPressed) {
            console.log(mouseIsPressed)
            if(!editMode){ //drawing mode
                //save currrent mouse position in currentSHape
                currentShape.push({x:mouseX,y:mouseY});
            }
        } else { //edit mode
            //look for nearest vertex to the mouse and move it with mouse position
            for(var i=0;i<currentShape.length;i++) {
                var d = dist(currentShape[i].x,currentShape[i].y,mouseX,mouseY);
                if(d<15) {
                    currentShape[i].x = mouseX;
                    currentShape[i].y = mouseY;
                }
            }
        }

        //redraw the drawing sing vertices in currentShape
        beginShape();
        for (var i=0;i<currentShape.length;i++) {
            vertex(currentShape[i].x,currentShape[i].y);
            
            if(editMode) {
                //draw circles at vertices.
                fill('red');
                ellipse(currentShape[i].x,currentShape[i].y,10);
                noFill();
            }
        }
        endShape();
    }

    this.mouseReleased = function() {
        if(checkWithinCanvas(canvas) && !editMode) {
            editButton.style('display','block');
            finishButton.style('display','block');
        }
    }

    this.unselectTool = function() {
        select('#tool-options').html('');
        this.finishButtonPressed();
    }

    this.populateOptions = function() {
        noFill();
        loadPixels();

        //setup two buttons
        editButton = createButton('Edit Shape');
        finishButton = createButton('Finish Shape');

        editButton.mousePressed(this.editButtonPressed);
        finishButton.mousePressed(this.finishButtonPressed);
        editButton.parent('#tool-options');
        finishButton.parent('#tool-options');
    }

    this.editButtonPressed = function() {
        console.log('edit button pressed')
        if (editMode) {
            editMode = false; //change to drawing mode
            editButton.html('Edit Shape');
        } else { //in drawing mode
            editMode = true; //change to edit mode
            editButton.html('Add Vertices')
        }
        console.log('edit mode: ' + editMode);
    }

    this.finishButtonPressed = function() {
        editMode = false;
        editButton.html('Edit Shape');
        draw();
        loadPixels();
        currentShape = [];
        editButton.style('display','none');
        finishButton.style('display','none');
    }
}