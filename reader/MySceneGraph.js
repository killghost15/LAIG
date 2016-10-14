
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
		this.scene.perspectiveList.push(this.reader.getFloat(tempper.getElementsByTagName('perspective')[0],'near'));
		this.scene.sperspectiveList.push(this.reader.getFloat(tempper.getElementsByTagName('perspective')[0],'far'));
		this.scene.perspectiveList.push(this.reader.getFloat(tempper.getElementsByTagName('perspective')[0],'angle'));
		this.scene.perspectiveList.push(this.reader.getFloat(tempper.getElementsByTagName('from')[0],'x'));
		this.scene.perspectiveList.push(this.reader.getFloat(tempper.getElementsByTagName('from')[0],'y'));
		this.scene.perspectiveList.push(this.reader.getFloat(tempper.getElementsByTagName('from')[0],'z'));
		this.scene.perspectiveList.push(this.reader.getFloat(tempper.getElementsByTagName('to')[0],'x'));
		this.scene.perspectiveList.push(this.reader.getFloat(tempper.getElementsByTagName('to')[0],'y'));
		this.scene.perspectiveList.push(this.reader.getFloat(tempper.getElementsByTagName('to')[0],'z'));
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
		
		
		if(templight.tagName=='omni'){
		this.scene.lightList.push('omni');
		this.scene.lightList.push(this.reader.getBoolean(templight.getElementsByTagName('omni')[0],'enabled'));
		this.scene.lightList.push(this.reader.getFloat(templight.getElementsByTagName('location')[0],'x'));
		this.scene.lightList.push(this.reader.getFloat(templight.getElementsByTagName('location')[0],'y'));
		this.scene.lightList.push(this.reader.getFloat(templight.getElementsByTagName('location')[0],'z'));
		this.scene.lightList.push(this.reader.getFloat(templight.getElementsByTagName('location')[0],'w'));
		this.scene.lightList.push(this.reader.getFloat(templight.getElementsByTagName('ambient')[0],'r'));
		this.scene.lightList.push(this.reader.getFloat(templight.getElementsByTagName('ambient')[0],'g'));
		this.scene.lightList.push(this.reader.getFloat(templight.getElementsByTagName('ambient')[0],'b'));
		this.scene.lightList.push(this.reader.getFloat(templight.getElementsByTagName('ambient')[0],'a'));
		this.scene.lightList.push(this.reader.getFloat(templight.getElementsByTagName('diffuse')[0],'r'));
		this.scene.lightList.push(this.reader.getFloat(templight.getElementsByTagName('diffuse')[0],'g'));
		this.scene.lightList.push(this.reader.getFloat(templight.getElementsByTagName('diffuse')[0],'b'));
		this.scene.lightList.push(this.reader.getFloat(templight.getElementsByTagName('diffuse')[0],'a'));
		this.scene.lightList.push(this.reader.getFloat(templight.getElementsByTagName('specular')[0],'r'));
		this.scene.lightList.push(this.reader.getFloat(templight.getElementsByTagName('specular')[0],'g'));
		this.scene.lightList.push(this.reader.getFloat(templight.getElementsByTagName('specular')[0],'b'));
		this.scene.lightList.push(this.reader.getFloat(templight.getElementsByTagName('specular')[0],'a'));
	}
		
		if(templight.tagName=='spot'){
			this.scene.lightList.push('spot');
			this.scene.lightList.push(this.reader.getBoolean(templight.getElementsByTagName('spot')[0],'enabled'));
			this.scene.lightList.push(this.reader.getFloat(templight.getElementsByTagName('target')[0],'x'));
			this.scene.lightList.push(this.reader.getFloat(templight.getElementsByTagName('target')[0],'y'));
			this.scene.lightList.push(this.reader.getFloat(templight.getElementsByTagName('target')[0],'z'));
			this.scene.lightList.push(this.reader.getFloat(templight.getElementsByTagName('location')[0],'x'));
			this.scene.lightList.push(this.reader.getFloat(templight.getElementsByTagName('location')[0],'y'));
			this.scene.lightList.push(this.reader.getFloat(templight.getElementsByTagName('location')[0],'z'));
			this.scene.lightList.push(this.reader.getFloat(templight.getElementsByTagName('location')[0],'w'));
			this.scene.lightList.push(this.reader.getFloat(templight.getElementsByTagName('ambient')[0],'r'));
			this.scene.lightList.push(this.reader.getFloat(templight.getElementsByTagName('ambient')[0],'g'));
			this.scene.lightList.push(this.reader.getFloat(templight.getElementsByTagName('ambient')[0],'b'));
			this.scene.lightList.push(this.reader.getFloat(templight.getElementsByTagName('ambient')[0],'a'));
			this.scene.lightList.push(this.reader.getFloat(templight.getElementsByTagName('diffuse')[0],'r'));
			this.scene.lightList.push(this.reader.getFloat(templight.getElementsByTagName('diffuse')[0],'g'));
			this.scene.lightList.push(this.reader.getFloat(templight.getElementsByTagName('diffuse')[0],'b'));
			this.scene.lightList.push(this.reader.getFloat(templight.getElementsByTagName('diffuse')[0],'a'));
			this.scene.lightList.push(this.reader.getFloat(templight.getElementsByTagName('specular')[0],'r'));
			this.scene.lightList.push(this.reader.getFloat(templight.getElementsByTagName('specular')[0],'g'));
			this.scene.lightList.push(this.reader.getFloat(templight.getElementsByTagName('specular')[0],'b'));
			this.scene.lightList.push(this.reader.getFloat(templight.getElementsByTagName('specular')[0],'a'));
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
		
		
		this.scene.materialList.push(tempmaterial.getAttribute('id'));
		this.scene.materialList.push(this.reader.getFloat(tempmaterial.getElementsByTagName('emission')[0],'r'));
		this.scene.materialList.push(this.reader.getFloat(tempmaterial.getElementsByTagName('emission')[0],'g'));
		this.scene.materialList.push(this.reader.getFloat(tempmaterial.getElementsByTagName('emission')[0],'b'));
		this.scene.materialList.push(this.reader.getFloat(tempmaterial.getElementsByTagName('emission')[0],'a'));
		this.scene.materialList.push(this.reader.getFloat(tempmaterial.getElementsByTagName('ambient')[0],'r'));
		this.scene.materialList.push(this.reader.getFloat(tempmaterial.getElementsByTagName('ambient')[0],'g'));
		this.scene.materialList.push(this.reader.getFloat(tempmaterial.getElementsByTagName('ambient')[0],'b'));
		this.scene.materialList.push(this.reader.getFloat(tempmaterial.getElementsByTagName('ambient')[0],'a'));
		this.scene.materialList.push(this.reader.getFloat(tempmaterial.getElementsByTagName('diffuse')[0],'r'));
		this.scene.materialList.push(this.reader.getFloat(tempmaterial.getElementsByTagName('diffuse')[0],'g'));
		this.scene.materialList.push(this.reader.getFloat(tempmaterial.getElementsByTagName('diffuse')[0],'b'));
		this.scene.materialList.push(this.reader.getFloat(tempmaterial.getElementsByTagName('diffuse')[0],'a'));
		this.scene.materialList.push(this.reader.getFloat(tempmaterial.getElementsByTagName('shininess')[0],'value'));
	}
	
};
	
//#TODO Mudar isto pra interpretar como matriz e multiplicar
MySceneGraph.prototype.parseTransformations= function(rootElement){
	var elems =  rootElement.getElementsByTagName('transformations');
	if (elems == null) {
		return "transformations element is missing.";
	}

	/*if (elems.length < 1) {
		return "not enough 'materials' element found.";
	}*/
	this.transl=[];
	this.rot=[];
	this.scale=[];
	this.trasnformationList=[];
	var ntransformations=elems[0].children.length;
	for (var i=0;i<ntransformations;i++){
		
		var temptransformation=elems[0].children[i];
		
		this.transf_matrix = mat4.clone(mat4.create());
		this.id=temptransformation.getAttribute('id');
		this.scene.transformationList.push(this.id);
		//#TODO n sei se funciona
		if(temptransformation.getElementsByTagName('translate')[0]=='translate'){
			this.transl[0]=(this.reader.getFloat(temptransformation.getElementsByTagName('translate')[0],'x'));
			this.transl[1]=(this.reader.getFloat(temptransformation.getElementsByTagName('translate')[0],'y'));
			this.transl[2]=(this.reader.getFloat(temptransformation.getElementsByTagName('translate')[0],'z'));
			mat4.translate(this.transf_matrix, this.transf_matrix, [this.transl[0], this.transl[1], this.trans[2]])
			
		}
		if(temptransformation.getElementsByTagName('rotate')[0]=='rotate'){
			this.rot[0]=(this.reader.getString(temptransformation.getElementsByTagName('rotate')[0],'axis'));
			this.rot[1]=(this.reader.getFloat(temptransformation.getElementsByTagName('rotate')[0],'angle'));
			if(this.rot[1]=='x')
			mat4.rotate(this.transf_matrix, this.transf_matrix,this.rot[1]*Math.PI/180,[1,0,0]);
			
			if(this.rot[1]=='y')
				mat4.rotate(this.transf_matrix, this.transf_matrix,this.rot[1]*Math.PI/180,[0,1,0]);
			
		if(this.rot[1]=='z')
			mat4.rotate(this.transf_matrix, this.transf_matrix,this.rot[1]*Math.PI/180,[0,0,1]);
		}
		
		if(temptransformation.getElementsByTagName('translate')[0]=='translate'){
			this.scale[0]=(this.reader.getFloat(temptransformation.getElementsByTagName('scale')[0],'x'));
			this.scale[1]=(this.reader.getFloat(temptransformation.getElementsByTagName('scale')[0],'y'));
			this.scale[2]=(this.reader.getFloat(temptransformation.getElementsByTagName('scale')[0],'z'));
			mat4.scale(this.transf_matrix, this.transf_matrix, [this.transl[0], this.transl[1], this.trans[2]])
			
		}
		
		
		
		this.scene.trasnformationList.push(this.transf_matrix);
		
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
		
		this.scene.primitivesList.push(temprimitive.getAttribute('id'));
		//#TODO testar as primitivas
		if(temprimitive.getElementsByTagName('cylinder').length!=0){
		
		this.scene.primitivesList.push(this.reader.getFloat(temprimitive.getElementsByTagName('cylinder')[0],'base'));
		this.scene.primitivesList.push(this.reader.getFloat(temprimitive.getElementsByTagName('cylinder')[0],'top'));
		this.scene.primitivesList.push(this.reader.getFloat(temprimitive.getElementsByTagName('cylinder')[0],'height'));
		this.scene.primitivesList.push(this.reader.getInteger(temprimitive.getElementsByTagName('cylinder')[0],'slices'));
		this.scene.primitivesList.push(this.reader.getInteger(temprimitive.getElementsByTagName('cylinder')[0],'stack'));
		}
		
		if(temprimitive.getElementsByTagName('rectangle').length!=0){
		this.scene.primitivesList.push(this.reader.getFloat(temprimitive.getElementsByTagName('rectangle')[0],'x1'));
		this.scene.primitivesList.push(this.reader.getFloat(temprimitive.getElementsByTagName('rectangle')[0],'y1'));
		this.scene.primitivesList.push(this.reader.getFloat(temprimitive.getElementsByTagName('rectangle')[0],'x2'));
		this.scene.primitivesList.push(this.reader.getFloat(temprimitive.getElementsByTagName('rectangle')[0],'y2'));
		}
		if(temprimitive.getElementsByTagName('triangle').length!=0){
		this.scene.primitivesList.push(this.reader.getFloat(temprimitive.getElementsByTagName('triangle')[0],'x1'));
		this.scene.primitivesList.push(this.reader.getFloat(temprimitive.getElementsByTagName('triangle')[0],'y1'));
		this.scene.primitivesList.push(this.reader.getFloat(temprimitive.getElementsByTagName('triangle')[0],'z1'));
		this.scene.primitivesList.push(this.reader.getFloat(temprimitive.getElementsByTagName('triangle')[0],'x2'));
		this.scene.primitivesList.push(this.reader.getFloat(temprimitive.getElementsByTagName('triangle')[0],'y2'));
		this.scene.primitivesList.push(this.reader.getFloat(temprimitive.getElementsByTagName('triangle')[0],'z2'));
		this.scene.primitivesList.push(this.reader.getFloat(temprimitive.getElementsByTagName('triangle')[0],'x3'));
		this.scene.primitivesList.push(this.reader.getFloat(temprimitive.getElementsByTagName('triangle')[0],'y3'));
		this.scene.primitivesList.push(this.reader.getFloat(temprimitive.getElementsByTagName('triangle')[0],'z3'));
		}
		if(temprimitive.getElementsByTagName('sphere').length!=0){
		this.scene.primitivesList.push(this.reader.getFloat(temprimitive.getElementsByTagName('sphere')[0],'radius'));
		this.scene.primitivesList.push(this.reader.getInteger(temprimitive.getElementsByTagName('sphere')[0],'slices'));
		this.scene.primitivesList.push(this.reader.getInteger(temprimitive.getElementsByTagName('sphere')[0],'stacks'));
		}
		if(temprimitive.getElementsByTagName('torus').length!=0){
		this.scene.primitivesList.push(this.reader.getFloat(temprimitive.getElementsByTagName('torus')[0],'inner'));
		this.scene.primitivesList.push(this.reader.getFloat(temprimitive.getElementsByTagName('torus')[0],'outer'));
		this.scene.primitivesList.push(this.reader.getInteger(temprimitive.getElementsByTagName('torus')[0],'slices'));
		this.scene.primitivesList.push(this.reader.getInteger(temprimitive.getElementsByTagName('torus')[0],'loops'));
		}
		
		
	}
	
};

MySceneGraph.prototype.parseComponents=function(rootElement){
	
};



/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


