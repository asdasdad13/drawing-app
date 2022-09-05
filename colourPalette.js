//Displays and handles the colour palette.
function ColourPalette() {
	//a list of web colour strings
	this.colours = ["black", "silver", "gray", "white", "maroon", "red", "purple",
		"orange", "pink", "fuchsia", "green", "lime", "olive", "yellow", "navy",
		"blue", "teal", "cyan"];
	//make the start colour be black
	this.selectedStrokeColour = "black";
	this.selectedFillColour = "cyan";

	var self = this;

	var colourClick = function() {
		if (mouseButton == LEFT) { //left click = change selected stroke colour
			select("#strokeLetter").remove(); //remove old 'S'
			var letter = createP('S');
			letter.id('strokeLetter');
			self.selectedStrokeColour = this.id().split("Swatch")[0];;
		}
		else if (mouseButton == RIGHT) { //right click = change selected fill colour
			select("#fillLetter").remove(); //remove old 'F'
			var letter = createP('F');
			letter.id('fillLetter');
			self.selectedFillColour = this.id().split("Swatch")[0];
		}
		letter.parent(this);
	}

	//load in the colours
	this.loadColours = function() {
		//set the fill and stroke properties to be black at the start of the programme running
		stroke(this.selectedStrokeColour);
		fill(this.selectedFillColour);

		//for each colour create a new div in the html for the colourSwatches
		for (let i = 0; i < this.colours.length; i++) {
			var colourID = this.colours[i] + "Swatch";

			//using JQuery add the swatch to the palette and set its background colour
			//to be the colour value.
			var colourSwatch = createDiv()
			colourSwatch.class('colourSwatches');
			colourSwatch.id(colourID);

			select(".colourPalette").child(colourSwatch);
			select("#" + colourID).style("background-color", this.colours[i]);
			console.log(colourSwatch.mousePressed)
			colourSwatch.mousePressed(colourClick);
		}
		let strokeLetter = createP('S'); //left click = change selected stroke colour
		strokeLetter.parent('#' + this.selectedStrokeColour + 'Swatch');
		strokeLetter.id('strokeLetter');

		let fillLetter = createP('F'); //left click = change selected stroke colour
		fillLetter.parent('#' + this.selectedFillColour + 'Swatch');
		fillLetter.id('fillLetter');
	};
	//call the loadColours function now it is declared
	this.loadColours();
}