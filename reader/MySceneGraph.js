
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
	error= this.parseViews(rootElement);
	error = this.parseIllumination(rootElement);
	error = this.parseLights(rootElement);
	error = this.parseTextures(rootElement);
	error = this.parseMaterials(rootElement);
	error = this.parseTransformations(rootElement);
	error = this.parsePrimitves(rootElement);
	error=this.parseComponents(rootElement);
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

	

};
MySceneGraph.prototype.parseViews= function(rootElement){
	
	var elems =  rootElement.getElementsByTagName('views');
	if (elems == null) {
		return "views element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'views' element found.";
	}
	this.perspectiveList=[];
	var nperspectives=elems[0].children.length;
	for (var i=0;i<nperspectives;i++){
		
		var tempper=elems[0].children[i];
		this.perspectiveList.push(this.reader.getFloat(tempper.getElementsByTagName('perspective')[0],'near'));
		this.perspectiveList.push(this.reader.getFloat(tempper.getElementsByTagName('perspective')[0],'far'));
		this.perspectiveList.push(this.reader.getFloat(tempper.getElementsByTagName('perspective')[0],'angle'));
		this.perspectiveList.push(this.reader.getFloat(tempper.getElementsByTagName('from')[0],'x'));
		this.perspectiveList.push(this.reader.getFloat(tempper.getElementsByTagName('from')[0],'y'));
		this.perspectiveList.push(this.reader.getFloat(tempper.getElementsByTagName('from')[0],'z'));
		this.perspectiveList.push(this.reader.getFloat(tempper.getElementsByTagName('to')[0],'x'));
		this.perspectiveList.push(this.reader.getFloat(tempper.getElementsByTagName('to')[0],'y'));
		this.perspectiveList.push(this.reader.getFloat(tempper.getElementsByTagName('to')[0],'z'));
	}
};

MySceneGraph.prototype.parseIllumination=function(rootElement){
	var elems =  rootElement.getElementsByTagName('illumination');
	if (elems == null) {
		return "illumination element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'illumination' element found.";
	}
	
	var illum=elems[0];
	this.doublesided=this.reader.getBoolean(illum,'doublesided');
	this.local=this.reader.getBoolean(illum,'local');
	this.ambient_r=this.reader.getFloat(illum.children[0].getElementsByTagName('ambient')[0],'r');
	this.ambient_g=this.reader.getFloat(illum.children[0].getElementsByTagName('ambient')[0],'g');
	this.ambient_b=this.reader.getFloat(illum.children[0].getElementsByTagName('ambient')[0],'b');
	this.ambient_a=this.reader.getFloat(illum.children[0].getElementsByTagName('ambient')[0],'a');
	this.background_r=this.reader.getFloat(illum.children[0].getElementsByTagName('background')[0],'r');
	this.background_g=this.reader.getFloat(illum.children[0].getElementsByTagName('background')[0],'g');
	this.background_b=this.reader.getFloat(illum.children[0].getElementsByTagName('background')[0],'b');
	this.background_a=this.reader.getFloat(illum.children[0].getElementsByTagName('background')[0],'a');
	
};
MySceneGraph.prototype.parseLights= function(rootElement){
	
	var elems =  rootElement.getElementsByTagName('lights');
	if (elems == null) {
		return "lights element is missing.";
	}

	if (elems.length < 1) {
		return "not enough 'lights' element found.";
	}
	this.lightList=[];
	var nlights=elems[0].children.length;
	for (var i=0;i<nlights;i++){
		
		var templight=elems[0].children[i];
		
		
		if(this.reader.getBoolean(templight.getElementsByTagName('omni')[0],'enabled')!=null){
		this.lightList.push(this.reader.getBoolean(templight.getElementsByTagName('omni')[0],'enabled'));
		this.lightList.push(this.reader.getFloat(templight.getElementsByTagName('location')[0],'x'));
		this.lightList.push(this.reader.getFloat(templight.getElementsByTagName('location')[0],'y'));
		this.lightList.push(this.reader.getFloat(templight.getElementsByTagName('location')[0],'z'));
		this.lightList.push(this.reader.getFloat(templight.getElementsByTagName('location')[0],'w'));
		this.lightList.push(this.reader.getFloat(templight.getElementsByTagName('ambient')[0],'r'));
		this.lightList.push(this.reader.getFloat(templight.getElementsByTagName('ambient')[0],'g'));
		this.lightList.push(this.reader.getFloat(templight.getElementsByTagName('ambient')[0],'b'));
		this.lightList.push(this.reader.getFloat(templight.getElementsByTagName('ambient')[0],'a'));
		this.lightList.push(this.reader.getFloat(templight.getElementsByTagName('diffuse')[0],'r'));
		this.lightList.push(this.reader.getFloat(templight.getElementsByTagName('diffuse')[0],'g'));
		this.lightList.push(this.reader.getFloat(templight.getElementsByTagName('diffuse')[0],'b'));
		this.lightList.push(this.reader.getFloat(templight.getElementsByTagName('diffuse')[0],'a'));
		this.lightList.push(this.reader.getFloat(templight.getElementsByTagName('specular')[0],'r'));
		this.lightList.push(this.reader.getFloat(templight.getElementsByTagName('specular')[0],'g'));
		this.lightList.push(this.reader.getFloat(templight.getElementsByTagName('specular')[0],'b'));
		this.lightList.push(this.reader.getFloat(templight.getElementsByTagName('specular')[0],'a'));
	}
		
		if(this.reader.getBoolean(templight.getElementsByTagName('spot')[0],'enabled')!=null){
			this.lightList.push(this.reader.getBoolean(templight.getElementsByTagName('spot')[0],'enabled'));
			this.lightList.push(this.reader.getFloat(templight.getElementsByTagName('target')[0],'x'));
			this.lightList.push(this.reader.getFloat(templight.getElementsByTagName('target')[0],'y'));
			this.lightList.push(this.reader.getFloat(templight.getElementsByTagName('target')[0],'z'));
			this.lightList.push(this.reader.getFloat(templight.getElementsByTagName('location')[0],'x'));
			this.lightList.push(this.reader.getFloat(templight.getElementsByTagName('location')[0],'y'));
			this.lightList.push(this.reader.getFloat(templight.getElementsByTagName('location')[0],'z'));
			this.lightList.push(this.reader.getFloat(templight.getElementsByTagName('location')[0],'w'));
			this.lightList.push(this.reader.getFloat(templight.getElementsByTagName('ambient')[0],'r'));
			this.lightList.push(this.reader.getFloat(templight.getElementsByTagName('ambient')[0],'g'));
			this.lightList.push(this.reader.getFloat(templight.getElementsByTagName('ambient')[0],'b'));
			this.lightList.push(this.reader.getFloat(templight.getElementsByTagName('ambient')[0],'a'));
			this.lightList.push(this.reader.getFloat(templight.getElementsByTagName('diffuse')[0],'r'));
			this.lightList.push(this.reader.getFloat(templight.getElementsByTagName('diffuse')[0],'g'));
			this.lightList.push(this.reader.getFloat(templight.getElementsByTagName('diffuse')[0],'b'));
			this.lightList.push(this.reader.getFloat(templight.getElementsByTagName('diffuse')[0],'a'));
			this.lightList.push(this.reader.getFloat(templight.getElementsByTagName('specular')[0],'r'));
			this.lightList.push(this.reader.getFloat(templight.getElementsByTagName('specular')[0],'g'));
			this.lightList.push(this.reader.getFloat(templight.getElementsByTagName('specular')[0],'b'));
			this.lightList.push(this.reader.getFloat(templight.getElementsByTagName('specular')[0],'a'));
		}
	

}
		
	
};


MySceneGraph.prototype.parseTextures= function(rootElement){
	var elems =  rootElement.getElementsByTagName('textures');
	if (elems == null) {
		return "textures element is missing.";
	}

	if (elems.length < 1) {
		return "not enough 'textures' element found.";
	}
	this.textureList=[];
	var ntextures=elems[0].children.length;
	for (var i=0;i<ntextures;i++){
		
		var temptexture=elems[0].children[i];
		
		
		
		this.textureList.push(this.reader.getString(temptexture.getElementsByTagName('texture')[0],'file'));
		this.textureList.push(this.reader.getString(temptexture.getElementsByTagName('texture')[0],'length_s'));
		this.textureList.push(this.reader.getString(temptexture.getElementsByTagName('texture')[0],'length_t'));
	}	
};


MySceneGraph.prototype.parseMaterials= function(rootElement){
	var elems =  rootElement.getElementsByTagName('materials');
	if (elems == null) {
		return "materials element is missing.";
	}

	if (elems.length < 1) {
		return "not enough 'materials' element found.";
	}
	this.materialList=[];
	var nmaterials=elems[0].children.length;
	for (var i=0;i<ntextures;i++){
		
		var tempmaterial=elems[0].children[i];
		
		
		
		this.materialList.push(this.reader.getFloat(tempmaterial.getElementsByTagName('emission')[0],'r'));
		this.materialList.push(this.reader.getFloat(tempmaterial.getElementsByTagName('emission')[0],'g'));
		this.materialList.push(this.reader.getFloat(tempmaterial.getElementsByTagName('emission')[0],'b'));
		this.materialList.push(this.reader.getFloat(tempmaterial.getElementsByTagName('emission')[0],'a'));
		this.materialList.push(this.reader.getFloat(tempmaterial.getElementsByTagName('ambient')[0],'r'));
		this.materialList.push(this.reader.getFloat(tempmaterial.getElementsByTagName('ambient')[0],'g'));
		this.materialList.push(this.reader.getFloat(tempmaterial.getElementsByTagName('ambient')[0],'b'));
		this.materialList.push(this.reader.getFloat(tempmaterial.getElementsByTagName('ambient')[0],'a'));
		this.materialList.push(this.reader.getFloat(tempmaterial.getElementsByTagName('diffuse')[0],'r'));
		this.materialList.push(this.reader.getFloat(tempmaterial.getElementsByTagName('diffuse')[0],'g'));
		this.materialList.push(this.reader.getFloat(tempmaterial.getElementsByTagName('diffuse')[0],'b'));
		this.materialList.push(this.reader.getFloat(tempmaterial.getElementsByTagName('diffuse')[0],'a'));
		this.materialList.push(this.reader.getFloat(tempmaterial.getElementsByTagName('shininess')[0],'value'));
	}
	
};
	

MySceneGraph.prototype.parseTransformations= function(rootElement){
	var elems =  rootElement.getElementsByTagName('transformations');
	if (elems == null) {
		return "materials element is missing.";
	}

	if (elems.length < 1) {
		return "not enough 'materials' element found.";
	}
	this.trasnformationList=[];
	var ntransformations=elems[0].children.length;
	for (var i=0;i<ntransformations;i++){
		
		var temptransformation=elems[0].children[i];
		
		
		
		this.trasnformationList.push(this.reader.getFloat(temptransformation.getElementsByTagName('translate')[0],'x'));
		this.trasnformationList.push(this.reader.getFloat(temptransformation.getElementsByTagName('translate')[0],'y'));
		this.trasnformationList.push(this.reader.getFloat(temptransformation.getElementsByTagName('translate')[0],'z'));
		this.trasnformationList.push(this.reader.getItem(temptransformation.getElementsByTagName('rotate')[0],'axis'));
		this.trasnformationList.push(this.reader.getFloat(temptransformation.getElementsByTagName('rotate')[0],'angle'));
		this.trasnformationList.push(this.reader.getFloat(temptransformation.getElementsByTagName('scale')[0],'x'));
		this.trasnformationList.push(this.reader.getFloat(temptransformation.getElementsByTagName('scale')[0],'y'));
		this.trasnformationList.push(this.reader.getFloat(temptransformation.getElementsByTagName('scale')[0],'z'));
	}
	
};

MySceneGraph.prototype.parsePrimitives= function(rootElement){
	var elems =  rootElement.getElementsByTagName('primitives');
	if (elems == null) {
		return "primitives element is missing.";
	}

	if (elems.length < 1) {
		return "not enough 'primitives' element found.";
	}
	this.primitivesList=[];
	var nprimitives=elems[0].children.length;
	for (var i=0;i<nprimitives;i++){
		
		var temprimitive=elems[0].children[i];
		
		
		
		this.primitivesList.push(this.reader.getFloat(temprimitive.getElementsByTagName('cylinder')[0],'base'));
		this.primitivesList.push(this.reader.getFloat(temprimitive.getElementsByTagName('cylinder')[0],'top'));
		this.primitivesList.push(this.reader.getFloat(temprimitive.getElementsByTagName('cylinder')[0],'height'));
		this.primitivesList.push(this.reader.getInteger(temprimitive.getElementsByTagName('cylinder')[0],'slices'));
		this.primitivesList.push(this.reader.getInteger(temprimitive.getElementsByTagName('cylinder')[0],'stack'));
		this.primitivesList.push(this.reader.getFloat(temprimitive.getElementsByTagName('rectangle')[0],'x1'));
		this.primitivesList.push(this.reader.getFloat(temprimitive.getElementsByTagName('rectangle')[0],'y1'));
		this.primitivesList.push(this.reader.getFloat(temprimitive.getElementsByTagName('rectangle')[0],'x2'));
		this.primitivesList.push(this.reader.getFloat(temprimitive.getElementsByTagName('rectangle')[0],'y2'));
		this.primitivesList.push(this.reader.getFloat(temprimitive.getElementsByTagName('triangle')[0],'x1'));
		this.primitivesList.push(this.reader.getFloat(temprimitive.getElementsByTagName('triangle')[0],'y1'));
		this.primitivesList.push(this.reader.getFloat(temprimitive.getElementsByTagName('triangle')[0],'z1'));
		this.primitivesList.push(this.reader.getFloat(temprimitive.getElementsByTagName('triangle')[0],'x2'));
		this.primitivesList.push(this.reader.getFloat(temprimitive.getElementsByTagName('triangle')[0],'y2'));
		this.primitivesList.push(this.reader.getFloat(temprimitive.getElementsByTagName('triangle')[0],'z2'));
		this.primitivesList.push(this.reader.getFloat(temprimitive.getElementsByTagName('triangle')[0],'x3'));
		this.primitivesList.push(this.reader.getFloat(temprimitive.getElementsByTagName('triangle')[0],'y3'));
		this.primitivesList.push(this.reader.getFloat(temprimitive.getElementsByTagName('triangle')[0],'z3'));
		this.primitivesList.push(this.reader.getFloat(temprimitive.getElementsByTagName('sphere')[0],'radius'));
		this.primitivesList.push(this.reader.getInteger(temprimitive.getElementsByTagName('sphere')[0],'slices'));
		this.primitivesList.push(this.reader.getInteger(temprimitive.getElementsByTagName('sphere')[0],'stacks'));
		this.primitivesList.push(this.reader.getFloat(temprimitive.getElementsByTagName('torus')[0],'inner'));
		this.primitivesList.push(this.reader.getFloat(temprimitive.getElementsByTagName('torus')[0],'outer'));
		this.primitivesList.push(this.reader.getInteger(temprimitive.getElementsByTagName('torus')[0],'slices'));
		this.primitivesList.push(this.reader.getInteger(temprimitive.getElementsByTagName('torus')[0],'loops'));
		
		
	}
	
};

/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


