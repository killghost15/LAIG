
function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;
		
	// File reading 
	this.reader = new CGFXMLreader();

	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */
	 
	this.reader.open('scenes/'+filename, this);  
}

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady=function() 
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement; //DSX aqui
	
	// Here should go the calls for different functions to parse the various blocks
	var error = this.parseGlobals(rootElement);
	error = this.parseIllumination(rootElement);
	/*error = this.parseLights(rootElement);
	error = this.parseTextures(rootElement);
	error = this.parseMaterials(rootElement);
	error = this.parseLeaves(rootElement);
	error = this.parseNodes(rootElement);*/ 
	if (error != null) {
		this.onXMLError(error);
		return;
	}	

	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};



/*
 * Example of method that parses elements of one block and stores information in a specific data structure
 */
MySceneGraph.prototype.parseGlobals= function(rootElement) {
	
	var elems =  rootElement.getElementsByTagName('scene');
	if (elems == null) {
		return "globals element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'globals' element found.";
	}

	// various examples of different types of access
	var globals = elems[0];
	this.depth_func = this.reader.Item(globals, 'depth_func');  //este ano tem q ler um dos parametros do RGB separados
	this.lighting = this.reader.getItem(globals, 'lighting', ["enable"]);
	this.cullface = this.reader.getItem(globals, 'cull_face', ["back","enable"]);
	this.front_face = this.reader.getItem(globals, 'front_face', ["CCW","CW"]);
	this.shading=this.reader.getItem(globals,'shading');
	this.polygon_mode=this.reader.getItem(globals,'polygon_mode',["fill"]);
	this.axis_length=this.reader.getFloat(globals,'axis_length');
	console.log("Globals read from file: {front_face=" + this.front_face + ", lighting=" + this.lighting + ", cullface=" + this.cullface + ", shading=" + this.shading + ",polygon mode=" + this.polygon_mode +",axis length="+this.axis_length + "}");

	var tempList=rootElement.getElementsByTagName('list');

	if (tempList == null  || tempList.length==0) {
		return "list element is missing.";
	}
	
	this.list=[];
	// iterate over every element
	var nnodes=tempList[0].children.length;
	for (var i=0; i< nnodes; i++)
	{
		var e=tempList[0].children[i];

		// process each element and store its information
		this.list[e.id]=e.attributes.getNamedItem("coords").value;
		console.log("Read list item id "+ e.id+" with value "+this.list[e.id]);
	};

};
MySceneGraph.prototype.parseIllumination= function(rootElement){
	
};
	
/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


