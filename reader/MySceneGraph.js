function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;
		this.nodes=[];
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
	var error;
	error =this.parseGlobals(rootElement);
	error= this.parseViews(rootElement);
	error = this.parseIllumination(rootElement);
	error = this.parseLights(rootElement);
	error = this.parseTextures(rootElement);
	error = this.parseMaterials(rootElement);
	error = this.parseTransformations(rootElement);
	error = this.parsePrimitives(rootElement);
	error = this.parseComponents(rootElement);
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
		return "scene element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'scene' element found.";
	}

	// various examples of different types of access
	var globals = elems[0];
	this.axis_length=this.reader.getFloat(globals,'axis_length');
	
	

	

};
MySceneGraph.prototype.parseViews= function(rootElement){
	
	var elems =  rootElement.getElementsByTagName('views');
	if (elems == null) {
		return "views element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'views' element found.";
	}
	
	var nperspectives=elems[0].children.length;
	for (var i=0;i<nperspectives;i++){
		
		var tempper=elems[0].children[i];
		this.scene.perspectiveList.push(tempper.getAttribute('id'));
		this.scene.perspectiveList.push(parseFloat(tempper.getAttribute('near')));
		this.scene.perspectiveList.push(parseFloat(tempper.getAttribute('far')));
		this.scene.perspectiveList.push(parseFloat(tempper.getAttribute('angle'))*Math.PI/180);
		this.scene.perspectiveList.push(parseFloat(tempper.children[0].getAttribute('x')));
		this.scene.perspectiveList.push(parseFloat(tempper.children[0].getAttribute('y')));
		this.scene.perspectiveList.push(parseFloat(tempper.children[0].getAttribute('z')));
		this.scene.perspectiveList.push(parseFloat(tempper.children[1].getAttribute('x')));
		this.scene.perspectiveList.push(parseFloat(tempper.children[1].getAttribute('y')));
		this.scene.perspectiveList.push(parseFloat(tempper.children[1].getAttribute('z')));
		
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
	//#TODO put these variables in xml scene
	var illum=elems[0];
	this.doublesided=this.reader.getBoolean(illum,'doublesided');
	this.local=this.reader.getBoolean(illum,'local');
	
	this.ambient_r=parseFloat(illum.children[0].getAttribute('r'));
	this.ambient_g=parseFloat(illum.children[0].getAttribute('g'));
	this.ambient_b=parseFloat(illum.children[0].getAttribute('b'));
	this.ambient_a=parseFloat(illum.children[0].getAttribute('a'));
	this.background_r=parseFloat(illum.children[1].getAttribute('r'));
	this.background_g=parseFloat(illum.children[1].getAttribute('g'));
	this.background_b=parseFloat(illum.children[1].getAttribute('b'));
	this.background_a=parseFloat(illum.children[1].getAttribute('a'));
	
};
MySceneGraph.prototype.parseLights= function(rootElement){
	
	var elems =  rootElement.getElementsByTagName('lights');
	if (elems == null) {
		return "lights element is missing.";
	}

	if (elems.length < 1) {
		return "not enough 'lights' element found.";
	}
	
	var nlights=elems[0].children.length;
	for (var i=0;i<nlights;i++){
		
		var templight=elems[0].children[i];
		
		
		if(templight.tagName=='omni'){
		this.scene.lightList.push('omni');
		this.scene.lightList.push(templight.getAttribute('id'));
		
		
		this.scene.lightList.push(templight.getAttribute('enabled'));
		this.scene.lightList.push(parseFloat(templight.children[0].getAttribute('x')));
		this.scene.lightList.push(parseFloat(templight.children[0].getAttribute('y')));
		this.scene.lightList.push(parseFloat(templight.children[0].getAttribute('z')));
		this.scene.lightList.push(parseFloat(templight.children[0].getAttribute('w')));
		this.scene.lightList.push(parseFloat(templight.children[1].getAttribute('r')));
		this.scene.lightList.push(parseFloat(templight.children[1].getAttribute('g')));
		this.scene.lightList.push(parseFloat(templight.children[1].getAttribute('b')));
		this.scene.lightList.push(parseFloat(templight.children[1].getAttribute('a')));
		this.scene.lightList.push(parseFloat(templight.children[2].getAttribute('r')));
		this.scene.lightList.push(parseFloat(templight.children[2].getAttribute('g')));
		this.scene.lightList.push(parseFloat(templight.children[2].getAttribute('b')));
		this.scene.lightList.push(parseFloat(templight.children[2].getAttribute('a')));
		this.scene.lightList.push(parseFloat(templight.children[3].getAttribute('r')));
		this.scene.lightList.push(parseFloat(templight.children[3].getAttribute('g')));
		this.scene.lightList.push(parseFloat(templight.children[3].getAttribute('b')));
		this.scene.lightList.push(parseFloat(templight.children[3].getAttribute('a')));
	}
		
		if(templight.tagName=='spot'){
			this.scene.lightList.push('spot');
			this.scene.lightList.push(templight.getAttribute('id'));
			this.scene.lightList.push(templight.getAttribute('enabled'));
			this.scene.lightList.push(parseFloat(templight.getAttribute('angle'))*Math.PI/180);
			this.scene.lightList.push(parseFloat(templight.getAttribute('exponent')));
			this.scene.lightList.push(parseFloat(templight.children[0].getAttribute('x')));
			this.scene.lightList.push(parseFloat(templight.children[0].getAttribute('y')));
			this.scene.lightList.push(parseFloat(templight.children[0].getAttribute('z')));
			this.scene.lightList.push(parseFloat(templight.children[1].getAttribute('x')));
			this.scene.lightList.push(parseFloat(templight.children[1].getAttribute('y')));
			this.scene.lightList.push(parseFloat(templight.children[1].getAttribute('z')));
			this.scene.lightList.push(parseFloat(templight.children[1].getAttribute('w')));
			this.scene.lightList.push(parseFloat(templight.children[2].getAttribute('r')));
			this.scene.lightList.push(parseFloat(templight.children[2].getAttribute('g')));
			this.scene.lightList.push(parseFloat(templight.children[2].getAttribute('b')));
			this.scene.lightList.push(parseFloat(templight.children[2].getAttribute('a')));
			this.scene.lightList.push(parseFloat(templight.children[3].getAttribute('r')));
			this.scene.lightList.push(parseFloat(templight.children[3].getAttribute('g')));
			this.scene.lightList.push(parseFloat(templight.children[3].getAttribute('b')));
			this.scene.lightList.push(parseFloat(templight.children[3].getAttribute('a')));
			this.scene.lightList.push(parseFloat(templight.children[4].getAttribute('r')));
			this.scene.lightList.push(parseFloat(templight.children[4].getAttribute('g')));
			this.scene.lightList.push(parseFloat(templight.children[4].getAttribute('b')));
			this.scene.lightList.push(parseFloat(templight.children[4].getAttribute('a')));
			
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

	var ntextures=elems[0].children.length;
	for (var i=0;i<ntextures;i++){
		
		var temptexture=elems[0].children[i];
		
		
		this.scene.texturesList.push(temptexture.getAttribute('id'));
		this.scene.texturesList.push(temptexture.getAttribute('file'));
		this.scene.texturesList.push(parseFloat(temptexture.getAttribute('length_s')));
		this.scene.texturesList.push(parseFloat(temptexture.getAttribute('length_t')));
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
	
	var nmaterials=elems[0].children.length;
	for (var i=0;i<nmaterials;i++){
		
		var tempmaterial=elems[0].children[i];
		
		
		this.scene.materialList.push(tempmaterial.getAttribute('id'));
		this.scene.materialList.push(parseFloat(tempmaterial.children[0].getAttribute('r')));
		this.scene.materialList.push(parseFloat(tempmaterial.children[0].getAttribute('g')));
		this.scene.materialList.push(parseFloat(tempmaterial.children[0].getAttribute('b')));
		this.scene.materialList.push(parseFloat(tempmaterial.children[0].getAttribute('a')));
		this.scene.materialList.push(parseFloat(tempmaterial.children[1].getAttribute('r')));
		this.scene.materialList.push(parseFloat(tempmaterial.children[1].getAttribute('g')));
		this.scene.materialList.push(parseFloat(tempmaterial.children[1].getAttribute('b')));
		this.scene.materialList.push(parseFloat(tempmaterial.children[1].getAttribute('a')));
		this.scene.materialList.push(parseFloat(tempmaterial.children[2].getAttribute('r')));
		this.scene.materialList.push(parseFloat(tempmaterial.children[2].getAttribute('g')));
		this.scene.materialList.push(parseFloat(tempmaterial.children[2].getAttribute('b')));
		this.scene.materialList.push(parseFloat(tempmaterial.children[2].getAttribute('a')));
		this.scene.materialList.push(parseFloat(tempmaterial.children[3].getAttribute('r')));
		this.scene.materialList.push(parseFloat(tempmaterial.children[3].getAttribute('g')));
		this.scene.materialList.push(parseFloat(tempmaterial.children[3].getAttribute('b')));
		this.scene.materialList.push(parseFloat(tempmaterial.children[3].getAttribute('a')));
		
		this.scene.materialList.push(parseFloat(tempmaterial.children[4].getAttribute('value')));
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
	
	var ntransformations=elems[0].children.length;
	for (var i=0;i<ntransformations;i++){
		
		var temptransformation=elems[0].children[i];
		
		this.transf_matrix = mat4.clone(mat4.create());
		this.scene.transformationList.push(temptransformation.getAttribute('id'));
		for(var j=0;j<temptransformation.children.length;j++){
		//#TODO n sei se funciona adicionar o entendimento de q pode haver vários translates seguidos logo tem de ter um for()
		if(temptransformation.children[j].tagName=='translate'){
			this.transl[0]=(temptransformation.children[j].getAttribute('x'));
			
			this.transl[1]=(temptransformation.children[j].getAttribute('y'));
			this.transl[2]=(temptransformation.children[j].getAttribute('z'));
			mat4.translate(this.transf_matrix, this.transf_matrix, [this.transl[0], this.transl[1], this.transl[2]])
			
		}
		if(temptransformation.children[j].tagName=='rotate'){
			this.rot[0]=(temptransformation.children[j].getAttribute('axis'));
			this.rot[1]=(temptransformation.children[j].getAttribute('angle'));
			if(this.rot[1]=='x')
			mat4.rotate(this.transf_matrix, this.transf_matrix,this.rot[1]*Math.PI/180,[1,0,0]);
			
			if(this.rot[1]=='y')
				mat4.rotate(this.transf_matrix, this.transf_matrix,this.rot[1]*Math.PI/180,[0,1,0]);
			
		if(this.rot[1]=='z')
			mat4.rotate(this.transf_matrix, this.transf_matrix,this.rot[1]*Math.PI/180,[0,0,1]);
		}
		
		if(temptransformation.children[j].tagName=='scale'){
			this.scale[0]=(temptransformation.children[j].getAttribute('x'));
			this.scale[1]=(temptransformation.children[j].getAttribute('y'));
			this.scale[2]=(temptransformation.children[j].getAttribute('z'));
			mat4.scale(this.transf_matrix, this.transf_matrix, [this.scale[0], this.scale[1], this.scale[2]])
			
		}
		
		}
		
		this.scene.transformationList.push(this.transf_matrix);
		
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
	
	var nprimitives=elems[0].children.length;
	for (var i=0;i<nprimitives;i++){
		
		var temprimitive=elems[0].children[i];
		
		this.scene.primitiveList.push(temprimitive.getAttribute('id'));
		//#TODO testar as primitivas
		if(temprimitive.children[0].tagName=='cylinder'){
		this.scene.primitiveList.push("cylinder");
		this.scene.primitiveList.push(parseFloat(temprimitive.children[0].getAttribute('base')));
		this.scene.primitiveList.push(parseFloat(temprimitive.children[0].getAttribute('top')));
		this.scene.primitiveList.push(parseFloat(temprimitive.children[0].getAttribute('height')));
		this.scene.primitiveList.push(parseInt(temprimitive.children[0].getAttribute('slices')));
		this.scene.primitiveList.push(parseInt(temprimitive.children[0].getAttribute('stacks')));
		}
		
		if(temprimitive.children[0].tagName=='rectangle'){
		this.scene.primitiveList.push("rectangle");
		this.scene.primitiveList.push(parseFloat(temprimitive.children[0].getAttribute('x1')));
		this.scene.primitiveList.push(parseFloat(temprimitive.children[0].getAttribute('y1')));
		this.scene.primitiveList.push(parseFloat(temprimitive.children[0].getAttribute('x2')));
		this.scene.primitiveList.push(parseFloat(temprimitive.children[0].getAttribute('y2')));
		}
		if(temprimitive.children[0].tagName=='triangle'){
		this.scene.primitiveList.push("triangle");
		this.scene.primitiveList.push(parseFloat(temprimitive.children[0].getAttribute('x1')));
		this.scene.primitiveList.push(parseFloat(temprimitive.children[0].getAttribute('y1')));
		this.scene.primitiveList.push(parseFloat(temprimitive.children[0].getAttribute('z1')));
		this.scene.primitiveList.push(parseFloat(temprimitive.children[0].getAttribute('x2')));
		this.scene.primitiveList.push(parseFloat(temprimitive.children[0].getAttribute('y2')));
		this.scene.primitiveList.push(parseFloat(temprimitive.children[0].getAttribute('z2')));
		this.scene.primitiveList.push(parseFloat(temprimitive.children[0].getAttribute('x3')));
		this.scene.primitiveList.push(parseFloat(temprimitive.children[0].getAttribute('y3')));
		this.scene.primitiveList.push(parseFloat(temprimitive.children[0].getAttribute('z3')));
		}
		if(temprimitive.children[0].tagName=='sphere'){
		this.scene.primitiveList.push("sphere");
		this.scene.primitiveList.push(parseFloat(temprimitive.children[0].getAttribute('radius')));
		this.scene.primitiveList.push(parseInt(temprimitive.children[0].getAttribute('slices')));
		this.scene.primitiveList.push(parseInt(temprimitive.children[0].getAttribute('stacks')));
		}
		if(temprimitive.children[0].tagName=='torus'){
			this.scene.primitiveList.push("torus");
		this.scene.primitiveList.push(parseFloat(temprimitive.children[0].getAttribute('inner')));
		this.scene.primitiveList.push(parseFloat(temprimitive.children[0].getAttribute('outer')));
		this.scene.primitiveList.push(parseInt(temprimitive.children[0].getAttribute('slices')));
		this.scene.primitivsList.push(parseFloat(temprimitive.children[0].getAttribute('loops')));
		}
		
		
	}
	
};

MySceneGraph.prototype.parseComponents=function(rootElement){
	
	var elems =  rootElement.getElementsByTagName('components');

	if (elems == null) {
		return "components element is missing.";
	}

	if (elems.length < 1) {
		return "not enough 'components' element found.";
	}
	
	var nnodes=elems[0].children.length;
	
	for (var i=0;i<nnodes;i++){
		
		var tempcomponent=elems[0].children[i];
		this.scene.Idnodes.push(tempcomponent.id);
		if(this.nodes[tempcomponent.id]!=undefined){
			console.error("Node " + e + " already exists");
		}
		//se não existir o node então:
		else{
			//cria o node e coloca o na lista de nodes q está idexada por ids
		this.nodes[tempcomponent.id]=new DSXnode(this.scene);
		//console.log(tempcomponent.id +" material:"+ tempcomponent.children[1].children[0].getAttribute('id'));
		//default é o primeiro logo elemento 0 do material dentro dos materials; 
	    for(var k=0;k<tempcomponent.children[1].children.length;k++){
	    this.nodes[tempcomponent.id].addMaterial(tempcomponent.children[1].children[k].getAttribute('id'));
	   
		}
		
	    this.nodes[tempcomponent.id].setTex(tempcomponent.children[2].getAttribute('id'));
	    
	    //se existir um transformationref entra neste if; e depois vai procurar na lista de transformações o id igual e faz setmatrix neste nó com a matriz correspondente a esse id,que é o elemento a seguir ao id na lista
	    if(tempcomponent.children[0].children.length!=0){
	    if(tempcomponent.children[0].children[0].tagName=='transformationref'){
	    	var transformationid=tempcomponent.children[0].children[0].getAttribute('id');
	    	for(var j=0;j<this.scene.transformationList.length;j++){
	    		if(this.scene.transformationList[j]==transformationid){
	    			this.nodes[tempcomponent.id].setMatrix(this.scene.transformationList[j+1]);
	    			
	    		}
	    	}
	    	
	    	
	    }
	    //se não existir o transformationref vai ver se existe as transformações explicitas
	    else{
	    	this.transl=[];
			this.rot=[];
			this.scale=[];
			this.transf_matrix = mat4.clone(mat4.create());

	    	for(var j=0;j<tempcomponent.children[0].children.length;j++){
	    	if(tempcomponent.children[0].children[j].tagName=='translate'){
				this.transl[0]=(tempcomponent.children[0].children[j].getAttribute('x'));
				
				this.transl[1]=(tempcomponent.children[0].children[j].getAttribute('y'));
				this.transl[2]=(tempcomponent.children[0].children[j].getAttribute('z'));
				mat4.translate(this.transf_matrix, this.transf_matrix, [this.transl[0], this.transl[1], this.transl[2]])

				
			}
			if(tempcomponent.children[0].children[j].tagName=='rotate'){
				this.rot[0]=(tempcomponent.children[0].children[j].getAttribute('axis'));
				this.rot[1]=(tempcomponent.children[0].children[j].getAttribute('angle'));
				if(this.rot[1]=='x')
				mat4.rotate(this.transf_matrix, this.transf_matrix,this.rot[1]*Math.PI/180,[1,0,0]);
				
				if(this.rot[1]=='y')
					mat4.rotate(this.transf_matrix, this.transf_matrix,this.rot[1]*Math.PI/180,[0,1,0]);
				
			if(this.rot[1]=='z')
				mat4.rotate(this.transf_matrix, this.transf_matrix,this.rot[1]*Math.PI/180,[0,0,1]);
			}
			
			if(tempcomponent.children[0].children[j].tagName=='scale'){
				this.scale[0]=(tempcomponent.children[0].children[j].getAttribute('x'));
				this.scale[1]=(tempcomponent.children[0].children[j].getAttribute('y'));
				this.scale[2]=(tempcomponent.children[0].children[j].getAttribute('z'));
				mat4.scale(this.transf_matrix, this.transf_matrix, [this.scale[0], this.scale[1], this.scale[2]])
				
			}
			}
			this.nodes[tempcomponent.id].setMatrix(this.transf_matrix);
			
	    }
	   
		
			}
	    }
		//children block
		var tempchildren=tempcomponent.children[3];
		for(var k=0;k<tempchildren.children.length;){
			if(tempchildren.children[k].tagName=='componentref'){
				//console.log(tempchildren.children[k].getAttribute('id'));
			this.nodes[tempcomponent.id].addChild(tempchildren.children[k].getAttribute('id'));
			k++;
		}
			if(tempchildren.children[k].tagName=='primitiveref'){
				//console.log(tempchildren.children[k].getAttribute('id'));
				this.nodes[tempcomponent.id].addType(tempchildren.children[k].getAttribute('id'));
				
				k++;
			}
			
		}
		
		
			
		
	}
	
	
	
	
};



/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


