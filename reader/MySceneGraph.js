
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

	error = this.parseGlobals(rootElement);
	error = this.parseViews(rootElement);
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
		this.scene.perspectiveList.push(tempper.getAttribute('near'));
		this.scene.perspectiveList.push(tempper.getAttribute('far'));
		this.scene.perspectiveList.push(tempper.getAttribute('angle'));
		this.scene.perspectiveList.push(tempper.children[0].getAttribute('x'));
		this.scene.perspectiveList.push(tempper.children[0].getAttribute('y'));
		this.scene.perspectiveList.push(tempper.children[0].getAttribute('z'));
		this.scene.perspectiveList.push(tempper.children[1].getAttribute('x'));
		this.scene.perspectiveList.push(tempper.children[1].getAttribute('y'));
		this.scene.perspectiveList.push(tempper.children[1].getAttribute('z'));

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

	this.ambient_r=illum.children[0].getAttribute('r');
	this.ambient_g=illum.children[0].getAttribute('g');
	this.ambient_b=illum.children[0].getAttribute('b');
	this.ambient_a=illum.children[0].getAttribute('a');
	this.background_r=illum.children[1].getAttribute('r');
	this.background_g=illum.children[1].getAttribute('g');
	this.background_b=illum.children[1].getAttribute('b');
	this.background_a=illum.children[1].getAttribute('a');

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
			this.scene.lightList.push(templight.children[0].getAttribute('x'));
			this.scene.lightList.push(templight.children[0].getAttribute('y'));
			this.scene.lightList.push(templight.children[0].getAttribute('z'));
			this.scene.lightList.push(templight.children[0].getAttribute('w'));
			this.scene.lightList.push(templight.children[1].getAttribute('r'));
			this.scene.lightList.push(templight.children[1].getAttribute('g'));
			this.scene.lightList.push(templight.children[1].getAttribute('b'));
			this.scene.lightList.push(templight.children[1].getAttribute('a'));
			this.scene.lightList.push(templight.children[2].getAttribute('r'));;
			this.scene.lightList.push(templight.children[2].getAttribute('g'));
			this.scene.lightList.push(templight.children[2].getAttribute('b'));
			this.scene.lightList.push(templight.children[2].getAttribute('a'));
			this.scene.lightList.push(templight.children[3].getAttribute('r'));
			this.scene.lightList.push(templight.children[3].getAttribute('g'));
			this.scene.lightList.push(templight.children[3].getAttribute('b'));
			this.scene.lightList.push(templight.children[3].getAttribute('a'));
		}
		if(templight.tagName=='spot'){
			this.scene.lightList.push('spot');
			this.scene.lightList.push(templight.getAttribute('id'));
			this.scene.lightList.push(templight.getAttribute('enabled'));
			this.scene.lightList.push(templight.getAttribute('angle')*Math.PI/180);
			this.scene.lightList.push(templight.getAttribute('exponent'));
			this.scene.lightList.push(templight.children[0].getAttribute('x'));
			this.scene.lightList.push(templight.children[0].getAttribute('y'));
			this.scene.lightList.push(templight.children[0].getAttribute('z'));
			this.scene.lightList.push(templight.children[1].getAttribute('x'));
			this.scene.lightList.push(templight.children[1].getAttribute('y'));
			this.scene.lightList.push(templight.children[1].getAttribute('z'));
			this.scene.lightList.push(templight.children[1].getAttribute('w'));
			this.scene.lightList.push(templight.children[2].getAttribute('r'));
			this.scene.lightList.push(templight.children[2].getAttribute('g'));
			this.scene.lightList.push(templight.children[2].getAttribute('b'));
			this.scene.lightList.push(templight.children[2].getAttribute('a'));
			this.scene.lightList.push(templight.children[3].getAttribute('r'));
			this.scene.lightList.push(templight.children[3].getAttribute('g'));
			this.scene.lightList.push(templight.children[3].getAttribute('b'));
			this.scene.lightList.push(templight.children[3].getAttribute('a'));
			this.scene.lightList.push(templight.children[4].getAttribute('r'));
			this.scene.lightList.push(templight.children[4].getAttribute('g'));
			this.scene.lightList.push(templight.children[4].getAttribute('b'));
			this.scene.lightList.push(templight.children[4].getAttribute('a'));
		}
	}
};


MySceneGraph.prototype.parseTextures= function(rootElement){
	var elems =  rootElement.getElementsByTagName('textures');
	if (elems == null) {
		return "\"textures\" element is missing.";
	}

	if (elems.length != 1) {
		return "More than one \"textures\" element found";
	}

	this.scene.textures = [];
	var ntextures=elems[0].children.length;
	for (var i=0;i<ntextures;i++){
		var temptexture=elems[0].children[i];

		if(this.scene.textures[temptexture] != undefined) {
			console.log("Duplicate texture found: " + temptexture);
		}
		else {
			this.scene.textures[temptexture.id] = parseTexture(temptexture);
		}
	}
};

MySceneGraph.prototype.parseTexture = function (element) {
	var texture = [];

	texture['file'] = this.reader.getString(element.children[0], 'file', true);
	texture['texture'] = new CGFtexture(this.scene, texture['file']);
	texture['dimensions'] = this.parseDimentions(element.children[0]);
};

MySceneGraph.prototype.parseMaterials= function(rootElement){
	var elems =  rootElement.getElementsByTagName('materials');
	if (elems == null) {
		return "\"materials\" element is missing.";
	}
	else if (elems.length != 1) {
		return "More than one \"materials\" element found";
	}

	this.scene.materials = [];
	var nmaterials=elems[0].children.length;
	for (var i=0;i<nmaterials;i++){
		var tempmaterial=elems[0].children[i];

		if(this.scene.materials != undefined) {
			console.log ("Duplicate material: " + tempmaterial);
		}
		else {
			this.scene.materials[tempmaterial.id] = parseMaterial(tempmaterial);
		}
	}
};

MySceneGraph.prototype.parseMaterial = function (element) {
	var material_attrs[];

	material_attrs['emission'] = this.reader.parseColor(element.children[0]);
	material_attrs['ambient'] = this.reader.parseColor(element.children[1]);
	material_attrs['diffuse'] = this.reader.parseColor(element.children[2]);
	material_attrs['specular'] = this.reader.parseColor(element.children[3]);
	material_attrs['shininess'] = this.reader.getFloat(element.children[4], 'value', true);

	var material = new CGFAppearance(this.scene);
	material.setEmission(
		material_attrs['emission'].r,
		material_attrs['emission'].g,
		material_attrs['emission'].b,
		material_attrs['emission'].a
	);
	material.setAmbient(
		material_attrs['ambient'].r,
		material_attrs['ambient'].g,
		material_attrs['ambient'].b,
		material_attrs['ambient'].a
	);
	material.setDiffuse(
		material_attrs['diffuse'].r,
		material_attrs['diffuse'].g,
		material_attrs['diffuse'].b,
		material_attrs['diffuse'].a
	);
	material.setEmission(
		material_attrs['specular'].r,
		material_attrs['specular'].g,
		material_attrs['specular'].b,
		material_attrs['specular'].a
	);
	material.setShininess(
		material_attrs['shininess']
	);
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
	this.scene.trasnformationList.push(temptransformation.getAttribute('id'));
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

	var nprimitives=elems[0].children.length;
	for (var i=0;i<nprimitives;i++){

		var temprimitive=elems[0].children[i];

		this.scene.primitiveList.push(temprimitive.getAttribute('id'));
		//#TODO testar as primitivas
		if(temprimitive.children[0].tagName=='cylinder'){
			this.scene.primitiveList.push("cylinder");
			this.scene.primitiveList.push(temprimitive.children[0].getAttribute('base'));
			this.scene.primitiveList.push(temprimitive.children[0].getAttribute('top'));
			this.scene.primitiveList.push(temprimitive.children[0].getAttribute('height'));
			this.scene.primitiveList.push(temprimitive.children[0].getAttribute('slices'));
			this.scene.primitiveList.push(temprimitive.children[0].getAttribute('stacks'));
		}

		if(temprimitive.children[0].tagName=='rectangle'){
			this.scene.primitiveList.push("rectangle");
			this.scene.primitiveList.push(temprimitive.children[0].getAttribute('x1'));
			this.scene.primitiveList.push(temprimitive.children[0].getAttribute('y1'));
			this.scene.primitiveList.push(temprimitive.children[0].getAttribute('x2'));
			this.scene.primitiveList.push(temprimitive.children[0].getAttribute('y2'));
		}
		if(temprimitive.children[0].tagName=='triangle'){
			this.scene.primitiveList.push("triangle");
			this.scene.primitiveList.push(temprimitive.children[0].getAttribute('x1'));
			this.scene.primitiveList.push(temprimitive.children[0].getAttribute('y1'));
			this.scene.primitiveList.push(temprimitive.children[0].getAttribute('z1'));
			this.scene.primitiveList.push(temprimitive.children[0].getAttribute('x2'));
			this.scene.primitiveList.push(temprimitive.children[0].getAttribute('y2'));
			this.scene.primitiveList.push(temprimitive.children[0].getAttribute('z2'));
			this.scene.primitiveList.push(temprimitive.children[0].getAttribute('x3'));
			this.scene.primitiveList.push(temprimitive.children[0].getAttribute('y3'));
			this.scene.primitiveList.push(temprimitive.children[0].getAttribute('z3'));
		}
		if(temprimitive.children[0].tagName=='sphere'){
			this.scene.primitiveList.push("sphere");
			this.scene.primitiveList.push(temprimitive.children[0].getAttribute('radius'));
			this.scene.primitiveList.push(temprimitive.children[0].getAttribute('slices'));
			this.scene.primitiveList.push(temprimitive.children[0].getAttribute('stacks'));
		}
		if(temprimitive.children[0].tagName=='torus'){
			this.scene.primitiveList.push("torus");
			this.scene.primitiveList.push(temprimitive.children[0].getAttribute('inner'));
			this.scene.primitiveList.push(temprimitive.children[0].getAttribute('outer'));
			this.scene.primitiveList.push(temprimitive.children[0].getAttribute('slices'));
			this.scene.primitivsList.push(temprimitive.children[0].getAttribute('loops'));
		}


	}

};

MySceneGraph.prototype.parseComponents=function(rootElement){

	var elems =  rootElement.getElementsByTagName('components');
	console.log(elems);
	if (elems == null) {
		return "components element is missing.";
	}

	if (elems.length < 1) {
		return "not enough 'components' element found.";
	}
	this.transl=[];
	this.rot=[];
	this.scale=[];
	var nnodes=elems[0].children.length;
	this.transf_matrix = mat4.clone(mat4.create());
	for (var i=0;i<nnodes;i++){

		var tempcomponent=elems[0].children[i];
		if(this.nodes[tempcomponent.id]!=undefined){
			console.error("Node " + e + " already exists");
		}
		//se não existir o node então:
		else{
			//cria o node e coloca o na lista de nodes q está idexada por ids
			this.nodes[tempcomponent.id]=new DSXnode();

			//default é o primeiro logo elemento 0 do material dentro dos materials; será preciso procurar o ID na lista de materials asssim como o Texture
			this.nodes[tempcomponent.id].setMaterial(tempcomponent.children[1].children[0].getAttribute('id'));

			this.nodes[tempcomponent.id].setTexture(tempcomponent.children[2].getAttribute('id'));

			//se existir um transformationref entra neste if e depois vai procurar na lista de trasnformações o id igual e faz setmatrix neste nó com a matriz q é o elemento a seguir ao id na lista
			if(tempcomponent.children[0].children.length!=0){
				if(tempcomponent.children[0].children[0].tagName=='transformationref'){
					var transformationid=tempcomponent.children[1].children[0].getAttribute('id');
					for(var j=0;j<this.scene.transformationList.length;j++){
						if(this.scene.transformationList[j]==transformationid)
						this.nodes[tempcomponent.id].setMatrix(this.scene.transformationList[j+1]);
					}


				}
				//se não existir o transformationref vai ver se existe as transformações explicitas
				else{
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
		console.log(tempchildren);
		for(var k=0;k<tempchildren.length;k++){
			if(tempchildren.children[k].tagName=='componentref')
			this.nodes[tempcomponent.id].addChild(tempchildren.children[k].getAttribute('id'));
			if(tempchildren.children[k].tagName=='primitiveref')
			this.nodes[tempcomponent.id].setType(tempchildren.children[k].getAttribute('id'));

		}
		//#TODO o q fazer com o primitiveref deve ser o drawtype digo eu mas onde vamos guardar este drawtype



	}


};

MySceneGraph.prototype.parseColor = function(element) {
	var colors = new Object();
	colors.r = this.reader.getFloat(element, 'r');
	colors.g = this.reader.getFloat(element, 'g');
	colors.b = this.reader.getFloat(element, 'b');
	colors.a = this.reader.getFloat(element, 'a');
	return colors;
}

MySceneGraph.prototype.parseDimentions = function (element) {
	var dim = [];
	dim['s'] = this.reader.getFloat(element, 'length_s', true);
	dim['t'] = this.reader.getFloat(element, 'length_t', true);
	return dim;
};

/*
* Callback to be executed on any read error
*/

MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);
	this.loadedOk=false;
};
