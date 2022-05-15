function HelperFunctions() {
	//event handler for the clear button event. Clears the screen
	select("#clearButton").mouseClicked(function() {
		saveState(); //saveState() is called for every mousedown, so it has to be called one last time before removing the canvas image.
		pixels = set(0,0,blankCanvas);
	});

	//event handler for the save image button. saves the canvas to the local file system.
	select("#saveImageButton").mouseClicked(function() {
		saveCanvas("Untitled", "png");
	});
}