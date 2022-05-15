//global variables that will store the toolbox colour palette
//amnd the helper functions
var toolbox = null;
var colourP = null;
var helpers = null;
var stateHistory = [];
var stateFuture = [];

function setup() {
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
	background(255);
}

function draw() {
	//call the draw function from the selected tool.
	//hasOwnProperty is a javascript function that tests
	//if an object contains a particular method or property
	//if there isn't a draw method the app will alert the user
	if (toolbox.selectedTool.hasOwnProperty("draw")) {
		toolbox.selectedTool.draw();
	} else {
		alert("it doesn't look like your tool has a draw method!");
	}
}

function checkWithinCanvas(x,y) { //check that user mouse is on canvas, if it isn't, nothing will be drawn
	return (mouseX>=0 && mouseX<=canvasContainer.size().width && mouseY>=0 && mouseY<=canvasContainer.size().height)
}

function keyPressed(e) {
    if (e.ctrlKey && (e.key == 'z' || e.key == 'Z')) { //undo
		undo();
	}
	if (e.ctrlKey && (e.key == 'y' || e.key == 'Y')) { //redo
		redo();
	}
	if (e.key=='x') console.log(stateFuture)
}

function undo() {
	stateFuture.push(get());
	pixels = set(0,0,stateHistory.pop());
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