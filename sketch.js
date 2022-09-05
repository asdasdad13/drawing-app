//global variables that will store the toolbox colour palette
//amnd the helper functions
var toolbox = null;
var colourP = null;
var helpers = null;
var blankCanvas;
var stateHistory = [];
var stateFuture = [];
var stampShapes = [];

function preload() {
	stampShapes.push(new presetShapes('sparkles'));
	stampShapes.push(new presetShapes('cross'));
	stampShapes.push(new presetShapes('fish'));
	stampShapes.push(new presetShapes('star'));
	stampShapes.push(new presetShapes('barcode'));
	stampShapes.push(new presetShapes('minus'));
	stampShapes.push(new presetShapes('bolt'));
	stampShapes.push(new presetShapes('circle'));
	stampShapes.push(new presetShapes('heart'));
	stampShapes.push(new presetShapes('melon'));
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
	toolbox.addTool(new FreehandTool(), 'Draw freehand shapes. Hold shift while drawing to draw a straight line.');
	toolbox.addTool(new LineToTool(), 'Draw straight lines. Hold shift while drawing to snap your line to a 90° angle.');
	toolbox.addTool(new SprayCanTool(), 'Use a spray can to draw. Hold shift to spray in a straight line.');
	toolbox.addTool(new MirrorDrawTool(), 'Draw with symmetry. Click on the tool icon again to change orientation of symmetry. Hold shift while drawing to draw a straight line.');
	toolbox.addTool(new RectangleTool(), 'Draw rectangles. Hold shift while drawing to draw squares.');
	toolbox.addTool(new EllipseTool(), 'Draw ellipses. Hold shift while drawing to draw circles.');
	toolbox.addTool(new StampTool(), 'Stamp images onto the canvas. Hold shift while drawing to stamp in a straight line.');
	toolbox.addTool(new ScissorsTool(), 'Click and drag mouse on an area of the canvas to select an area to be cut, then click on "Cut Selection" to finalise the selection. Click "Paste Selection" to start pasting your selection by clicking on the canvas. Click "End paste" to enter selection mode again. Hold Shift while drawing to get a square selection.');

	background(255); //background must be present or undo/redo will not work
	blankCanvas = get(); //for resetting canvas to clean white image when cleared

	alert('Welcome!\nPlease hover your mouse over the tool icons to see notes on usage.\n\nEnjoy!');
}

function draw() {
	//call the draw function from the selected tool.
	//if there isn't a draw method the app will alert the user
	if (toolbox.selectedTool.hasOwnProperty("draw")) {
		// fill(colourP.selectedFillColour);//must reset colour after going to scissors tool
		// stroke(colourP.selectedStrokeColour)
		toolbox.selectedTool.draw();
	}
}

function checkWithinCanvas() { //check that user mouse is on canvas, if it isn't, nothing will be drawn
	return (mouseX>=0 && mouseX<=canvasContainer.size().width && mouseY>=0 && mouseY<=canvasContainer.size().height)
}

function mousePressed() {
	if (checkWithinCanvas()) saveState(); //allows for undoing/redoing, condition excludes clicking on tool icons
}

function keyPressed(e) {
    if (e.ctrlKey && (e.key == 'z' || e.key == 'Z')) { //undo
		undo();
	}
	if (e.ctrlKey && (e.key == 'y' || e.key == 'Y')) { //redo
		redo();
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

//preset shapes in stamp tool
class presetShapes {
	constructor(shapeName) {
		this.name = shapeName;
		this.shapeImg = loadImage('./assets/stampAssets/' + shapeName + '.png');
	}
}