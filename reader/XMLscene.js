
function XMLscene() {
    CGFscene.call(this);
    this.materialList=[];
    this.builtMaterials=[];
    this.transformationList=[];
    this.primitiveList=[];
    this.builtPrimitives=[];
    this.animationList=[];
    this.lightList=[];
    this.texturesList=[];
    this.builtTextures=[];
    this.nlights=0;
    this.perspectiveList=[];
    this.root;
    this.chessboardId=[];

    //used for iteration of nodesList that is indexed by Id and changing of materials on key pressed m
    this.Idnodes=[];
    
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    this.initLights();
    this.enableTextures(true);

    
	
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.view=0;
	this.axis=new CGFaxis(this);
    this.drawaxis=true;
    this.gameEngine = new GameEngine(this);
    this.luzes=[];
    this.time_date = new Date().getTime();
    this.pause=false;

    this.currentBoardState = [];
    this.currentBoard;
    this.setUpdatePeriod(10);

};
//mudar para selecionar de acordo com a interface

XMLscene.prototype.getTextureById=function(id){
 for(var i=0;i<this.builtTextures.length;i+=4){
        if(this.builtTextures[i]==id){
            return this.builtTextures[i+1];
        }
    }

}

XMLscene.prototype.getMaterialById=function(id){

    for(var i=0;i<this.builtMaterials.length;i+=2){
        if(this.builtMaterials[i]==id){
            return this.builtMaterials[i+1];
        }
    }
}
XMLscene.prototype.initLights = function () {
	
	
	/*
	for(var u=0; u<this.lights.length ; u++){
		this.lights[u].setVisible(true);
		this.lights[u].update();
	}*/
};

XMLscene.prototype.logPicking = function() 
{
    if (this.pickMode == false) {
        if (this.pickResults != null  && this.pickResults.length > 0) {
            for (var i = 0; i < this.pickResults.length; i++) {
                var obj = this.pickResults[i][0];
                if (obj) 
                {
                    var tileID = this.pickResults[i][1] - 1;
                    this.gameEngine.processPicking(tileID);
                }
            }
            this.pickResults.splice(0, this.pickResults.length);
        }
    }
};

XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};
//method that permites to pause all animations
XMLscene.prototype.Pause=function(){
    this.pause=!this.pause;
};



//Updates all nodes animations
XMLscene.prototype.update=function(currTime){
	 if (this.lastUpdate != 0) {
        this.elapsedTime = currTime - this.lastUpdate;
        this.elapsedTime /= 1000;
    }
     if (this.graph.loadedOk) {

    if(this.pause!=true){
    for(var i=0; i< this.Idnodes.length;i++){
        for(var g=0; g< this.builtPrimitives.length;g++){
            for(var h=0;h<this.chessboardId.length;h++)
            if(this.builtPrimitives[g]==this.chessboardId[h]){
               // this.builtPrimitives[g+1].update(0.1);
            }
        }

    this.graph.nodes[this.Idnodes[i]].updateAnimation(currTime);
}
}
}
}
//method that takes the disorganized arguments in materialList where it was stored from DSX and creates CGFappearences with it ready to be applied 
XMLscene.prototype.initMaterials = function() {
  for(var i = 0; i < this.materialList.length; i+= 18){
    this.builtMaterials.push(this.materialList[i]);
    this.material = new CGFappearance(this);
    this.material.setEmission(parseInt(this.materialList[i+1]),parseInt(this.materialList[i+2]),parseInt(this.materialList[i+3]),parseInt(this.materialList[i+4]));
    this.material.setAmbient(parseInt(this.materialList[i+5]),parseInt(this.materialList[i+6]),parseInt(this.materialList[i+7],this.materialList[i+8]));
    this.material.setDiffuse(parseInt(this.materialList[i+9]),parseInt(this.materialList[i+10]),parseInt(this.materialList[i+11]),parseInt(this.materialList[i+12]));
    this.material.setSpecular(parseInt(this.materialList[i+13]),parseInt(this.materialList[i+14]),parseInt(this.materialList[i+15]),parseInt(this.materialList[i+16]));
    this.material.setShininess(parseInt(this.materialList[i+17]));
    this.builtMaterials.push(this.material);
  }
}


//method that takes the disorganized arguments in texturesList where it was stored from DSX and creates CGF Textures ready to be bound to materials
XMLscene.prototype.initTextures = function () {
  for(var i = 0; i < this.texturesList.length; i += 4){
    this.builtTextures.push(this.texturesList[i]);
    this.texture = new CGFtexture(this, this.texturesList[i+1]);
    this.builtTextures.push(this.texture);
    
    this.builtTextures.push(parseInt(this.texturesList[i+2]));
    this.builtTextures.push(parseInt(this.texturesList[i+3]));
  }
};


//method that takes the disorganized arguments in primitiveList and creates the primitives ready to be displayed Torus geometry not created
XMLscene.prototype.initPrimitives = function () {
	var i = 0;
	while(i < this.primitiveList.length){
		this.builtPrimitives.push(this.primitiveList[i]);
		switch(this.primitiveList[i+1]){
			case "triangle":
				this.primitive = new MyTriangle(this,new MyPosition(this.primitiveList[i+2],this.primitiveList[i+3],this.primitiveList[i+4]),new MyPosition(this.primitiveList[i+5],this.primitiveList[i+6],this.primitiveList[i+7]),new MyPosition(this.primitiveList[i+8],this.primitiveList[i+9],this.primitiveList[i+10]));
				i+=11;
				break;
			case "rectangle":
				this.primitive = new MyRectangle(this,this.primitiveList[i+2],this.primitiveList[i+3],this.primitiveList[i+4],this.primitiveList[i+5]);
				i+=6;
				break;
			case "cylinder":
				this.primitive = new MyCilinder(this,this.primitiveList[i+2],this.primitiveList[i+3],this.primitiveList[i+4],this.primitiveList[i+5],this.primitiveList[i+6]);
				i+=7;
				break;
			case "sphere":
				this.primitive = new MySphere(this,this.primitiveList[i+3],this.primitiveList[i+4]);
				i+=5;
				break;
			case "torus":
				this.primitive = new MyTorus(this,this.primitiveList[i+2],this.primitiveList[i+3],this.primitiveList[i+4],this.primitiveList[i+5]);
				i+=6;
				break;
                case "plane":
                this.primitive=new Plane(this,this.primitiveList[i+2],this.primitiveList[i+3],this.primitiveList[i+4],this.primitiveList[i+5]);
                i+=6;
                break;
                case "patch":
                this.primitive = new Patch(this,this.primitiveList[i+2],this.primitiveList[i+3],this.primitiveList[i+4],this.primitiveList[i+5],this.primitiveList[i+6]);
                i+=7;
                break;
               case "vehicle":
                this.primitive = new Vehicle(this);
                i++;
                break;
                case "chessboard":
                this.chessboardId.push(this.primitiveList[i]);
                this.primitive = new Chessboard(this,this.primitiveList[i+2],this.primitiveList[i+3],this.primitiveList[i+4],this.primitiveList[i+5],this.primitiveList[i+6],this.primitiveList[i+7]);
                i+=8;
                break;
			default:
            i++;
				break;
					 }
		this.builtPrimitives.push(this.primitive);
	}
}

XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);	
};

//changes material no keypressed m/M
XMLscene.prototype.changeMaterial=function(){
    for(var i=0;i<this.Idnodes.length;i++){
        this.graph.nodes[this.Idnodes[i]].changeMaterialNode();
    }

}

//changes views on keypressed v/V
XMLscene.prototype.changeView=function(){
    this.view+=10;
    if(this.view>=this.perspectiveList.length)
        this.view=0;

    this.camera = new CGFcamera(this.perspectiveList[this.view+3], this.perspectiveList[this.view+1], this.perspectiveList[this.view+2], vec3.fromValues(this.perspectiveList[this.view+4], this.perspectiveList[this.view+5], this.perspectiveList[this.view+6]), vec3.fromValues(this.perspectiveList[this.view+7], this.perspectiveList[this.view+8], this.perspectiveList[this.view+9]));

}
XMLscene.prototype.Luz = function(interface) {
    interface.add(this,'luzes');
};
// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () 
{
	this.setGlobalAmbientLight(this.graph.ambient_r,this.graph.ambient_g,this.graph.ambient_b,this.graph.ambient_a);



    //starts the camera on the first perspective and then changes on keypressed with value this.view 
	//this.camera = new CGFcamera(this.perspectiveList[this.view+3], this.perspectiveList[this.view+1], this.perspectiveList[this.view+2], vec3.fromValues(this.perspectiveList[this.view+4], this.perspectiveList[this.view+5], this.perspectiveList[this.view+6]), vec3.fromValues(this.perspectiveList[this.view+7], this.perspectiveList[this.view+8], this.perspectiveList[this.view+9]));

	this.gl.clearColor(this.graph.background_r,this.graph.background_g,this.graph.background_b,this.graph.background_a);
	
    this.axis=new CGFaxis(this,this.graph.axis_length);

//loads the lights 
    for(var i=0,j=0;i< this.lightList.length;){

    	if(this.lightList[i]=="omni"){
    	if(this.lightList[i+2]=="true"){
    	this.lights[j].enable();
        this.lights[j].setVisible(true);
        this.luzes[this.lightList[i+1]]=true;
    	}
    	this.lights[j].setPosition(this.lightList[i+3],this.lightList[i+4],this.lightList[i+5],this.lightList[i+6]);
    	this.lights[j].setAmbient(this.lightList[i+7],this.lightList[i+8],this.lightList[i+9],this.lightList[i+10]);
    	this.lights[j].setDiffuse(this.lightList[i+11],this.lightList[i+12],this.lightList[i+13],this.lightList[i+14]);
    	this.lights[j].setSpecular(this.lightList[i+15],this.lightList[i+16],this.lightList[i+17],this.lightList[i+18]);
        i+=19;
        j++;

    	
    }
   
    	if(this.lightList[i]=="spot"){
        	if(this.lightList[i+2]=="true"){
        	this.lights[j].enable();
            this.lights[j].setVisible(true);
            this.luzes[this.lightList[i+1]]=true;

        	}
        	this.lights[j].setSpotCutOff(this.lightList[i+3]);
        	this.lights[j].setSpotExponent(this.lightList[i+4]);
        	this.lights[j].setSpotDirection(this.lightList[i+5]-this.lightList[i+8],this.lightList[i+6]-this.lightList[i+9],this.lightList[i+7]-this.lightList[i+10]);
        	this.lights[j].setPosition(this.lightList[i+8],this.lightList[i+9],this.lightList[i+10],this.lightList[i+11]);
        	this.lights[j].setAmbient(this.lightList[i+12],this.lightList[i+13],this.lightList[i+14],this.lightList[i+15]);
        	this.lights[j].setDiffuse(this.lightList[i+16],this.lightList[i+17],this.lightList[i+18],this.lightList[i+19]);
        	this.lights[j].setSpecular(this.lightList[i+20],this.lightList[i+21],this.lightList[i+22],this.lightList[i+23]);
            i+=24;
            j++;
        	
        }
    	
    	
    }
    this.nlights=j;
    
    this.initMaterials();
    this.initTextures();
    this.initPrimitives();

    if(this.currentBoard == null)
        this.currentBoard = new MyGameBoard(this,7,7);
    this.auxiliaryBoard = new MyAuxBoard(this);

};

XMLscene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup
	 this.logPicking();
    this.clearPickRegistration();

	
    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	// Draw axis
    if(this.drawaxis==true){
	this.axis.display();
}
	this.setDefaultAppearance();

	
	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.graph.loadedOk)
	{

       
		for(var u=0; u<this.nlights; u++){
       // this.lights[u].setVisible(true);
        this.lights[u].update();




    }
this.pushMatrix();
    this.graph.nodes[this.root].display(this, this.graph.nodes[this.root].material,  this.graph.nodes[this.root].matrix);
this.popMatrix();
        this.currentBoard.display();
        this.auxiliaryBoard.display();
	}

};

