//container object for storing the tools. Functions to add new tools and select a tool
function Toolbox() {

	var self = this;

	this.tools = [];
	this.selectedTool = null;

	var toolbarItemClick = function() {
		//remove any existing borders
		var items = selectAll(".sideBarItem");
		for (var i = 0; i < items.length; i++) {
			if (items[i].id()!='mirrorDrawsideBarItem' || self.selectedTool.name=='mirrorDraw') items[i].style('border', '0');
		}

		var toolName = this.id().split("sideBarItem")[0];
		self.selectTool(toolName); //select and unselects, depending on state
		//call loadPixels to make sure most recent changes are saved to pixel array
		loadPixels();
	}

	//add a new tool icon to the html page i.e. writes the HTML code
	var addToolIcon = function(icon, name) {
		var sideBarItem = createDiv("<img src='" + icon + "'>");
		sideBarItem.class('sideBarItem');
		sideBarItem.id(name + "sideBarItem");
		sideBarItem.parent('sidebar');
		sideBarItem.mouseClicked(toolbarItemClick);
	};

	//add a tool to the tools array
	this.addTool = function(tool) {
		//check that the object tool has an icon and a name
		if (!tool.hasOwnProperty("icon") || !tool.hasOwnProperty("name")) {
			alert("make sure your tool has both a name and an icon");
		}
		this.tools.push(tool);
		addToolIcon(tool.icon, tool.name);
		//if no tool is selected (ie. none have been added so far) make this tool the selected one.
		if (this.selectedTool == null) {
			this.selectTool(tool.name);
		}
	};

	this.selectTool = function(toolName) {
		for (var i = 0; i < this.tools.length; i++) {
			if (this.tools[i].name == toolName) {
				console.log(toolName,this.selectedTool)
				//if the tool has an unselectTool method run it.
				if (this.selectedTool != null && this.selectedTool.hasOwnProperty("unselectTool")) {
					this.selectedTool.unselectTool();
					selectAll(".sideBarItem")[i].style('border', '0');
				}
				//select the tool and highlight it on the toolbar
				if (toolName == 'mirrorDraw' && this.selectedTool.name == 'mirrorDraw') this.selectedTool.adjustOrientation(); // if mirrorDraw is active, this click changes the orientation of the symmetry line
				this.selectedTool = this.tools[i];
				select("#" + toolName + "sideBarItem").style("border", "2px solid cyan");
		
				//if the tool has an options area. Populate it now.
				if (this.selectedTool.hasOwnProperty("populateOptions")) {
					this.selectedTool.populateOptions();
				}
			}
		}
	};
}