//global variables that will store the toolbox colour palette
//amnd the helper functions
var toolbox = null;
var colourP = null;
var helpers = null;
var blankCanvas;
var stateHistory = [];
var stateFuture = [];
var stampImagesAr = Array(10);
var sparkles;
var selectMode;
var selectedArea;
var selectButton;
var selectedPixels;

function preload() {
	sparkles = loadImage('./assets/sparkles.png');
}

function setup() {
	document.addEventListener('contextmenu',e=>e.preventDefault()); //disable right-click

	//create a canvas to fill the content div from index.html
	canvasContainer = select('#content');
	var c = createCanvas(canvasContainer.size().width, canvasContainer.size().height); //canvas size resizes automaticcally based on user's screen res
	c.parent("content");

	//display initial canvas width
	select('#canvasWidthInfo').html(width + ' x ' + height);

	//create helper functions and the colour palette
	helpers = new HelperFunctions();
	colourP = new ColourPalette();

	//create a toolbox for storing the tools
	toolbox = new Toolbox();

	//add the tools to the toolbox.
	toolbox.addTool(new FreehandTool());
	toolbox.addTool(new LineToTool());
	toolbox.addTool(new SprayCanTool());
	toolbox.addTool(new MirrorDrawTool());
	toolbox.addTool(new RectangleTool());
	toolbox.addTool(new EllipseTool());
	toolbox.addTool(new StampTool());

	background(255); //background must be present or undo/redo will not work
	blankCanvas = get(); //for resetting canvas to clean white image when cleared

	selectMode = 0;
	selectedArea = {x: -1, y: -1, w: 100, y: 100};
	selectButton = select('#cutButton');
	selectButton.mousePressed(function() {
		if (selectMode == 0) {
			selectMode += 1;
			selectButton.html('Cut');
			loadPixels();
		} else if (selectMode == 1) {
			selectMode += 1;
			selectButton.html('End paste');
			updatePixels();

            selectedPixels = get(selectedArea.x,selectedArea.y,selectedArea.w,selectedArea.h);
			noStroke();
			//draw a rectangle over it
			fill(255);
			rect(selectedArea.x, selectedArea.y, selectedArea.w, selectedArea.h);
		} else if (selectMode == 2) {
			selectMode = 0;
			loadPixels();
			selectedArea = {x: -1, y: -1, w: 100, h: 100};
			selectButton.html('Select area to cut');
		}
	})
}

function draw() {
	//call the draw function from the selected tool.
	//if there isn't a draw method the app will alert the user
	if (toolbox.selectedTool.hasOwnProperty("draw")) {
		toolbox.selectedTool.draw();
	} else {
		alert("it doesn't look like your tool has a draw method!");
	}
	if (selectMode == 1) {
		updatePixels();
		noStroke();
		fill(0,70,100,100);
		rect(selectedArea.x, selectedArea.y, selectedArea.w, selectedArea.h);
	}
}

function checkWithinCanvas() { //check that user mouse is on canvas, if it isn't, nothing will be drawn
	return (mouseX>=0 && mouseX<=canvasContainer.size().width && mouseY>=0 && mouseY<=canvasContainer.size().height)
}

function mousePressed() {
	if (checkWithinCanvas()) saveState(); //allows for undoing/redoing, condition excludes clicking on tool icons
	if (selectMode == 1) {
		selectedArea.x = mouseX;
		selectedArea.y = mouseY;
	} else if (selectMode == 2 && checkWithinCanvas()) {
		image(selectedPixels,mouseX - selectedPixels.width/2,mouseY - selectedPixels.height/2);
	}
}

function mouseDragged() {
	if (selectMode == 1) {
		selectedArea.w = mouseX - selectedArea.x;
		selectedArea.h = mouseY - selectedArea.y;
	}
}

function keyPressed(e) {
    if (e.ctrlKey && (e.key == 'z' || e.key == 'Z')) { //undo
		undo();
	}
	if (e.ctrlKey && (e.key == 'y' || e.key == 'Y')) { //redo
		redo();
	}
	if (e.ctrlKey && (e.key == 'v' || e.key == 'V') && toolbox.selectedTool.name == 'scissorsTool') { //cut selection
		//scissors
		console.log('sketch 74 fix')
	}
}

function undo() {
	if (stateHistory.length != 0) {
		stateFuture.push(get());
		pixels = set(0,0,stateHistory.pop());
	}
}

function redo() {
	if (stateFuture.length != 0) {
		stateHistory.push(get());
		pixels = set(0,0,stateFuture.pop());
	}
}

function saveState() {
	stateHistory.push(get());
	stateFuture = [];
}