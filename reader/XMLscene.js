
function XMLscene() {
    CGFscene.call(this);
    this.trasnformationList=[];
    this.lightList=[];
    this.nlights=0;
    this.perspectiveList=[];


}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    this.initLights();



    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

	this.axis=new CGFaxis(this);
};

XMLscene.prototype.initLights = function () {


	/*
	for(var u=0; u<this.lights.length ; u++){
		this.lights[u].setVisible(true);
		this.lights[u].update();
	}*/
};

XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);
};

// Handler called when the graph is finally loaded.
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function ()
{
	this.setGlobalAmbientLight(this.graph.ambient_r,this.graph.ambient_g,this.graph.ambient_b,this.graph.ambient_a);
	// this.camera = new CGFcamera(this.perspectiveList[3]*Math.PI/180, this.perspectiveList[1], this.perspectiveList[2], vec3.fromValues(this.perspectiveList[4], this.perspectiveList[5], this.perspectiveList[6]), vec3.fromValues(this.perspectiveList[7], this.perspectiveList[8], this.perspectiveList[9]));
	this.gl.clearColor(this.graph.background_r,this.graph.background_g,this.graph.background_b,this.graph.background_a);
	/*this.lights[0].setVisible(true);
    this.lights[0].enable();*/
    this.axis=new CGFaxis(this,this.graph.axis_length);


    for(var i=0,j=0;i< this.lightList.length;){

    	if(this.lightList[i]=="omni"){
    	if(this.lightList[i+2]==true){
    	this.lights[j].enable()
    	}
    	this.lights[j].setPosition(this.lightList[i+3],this.lightList[i+4],this.lightList[i+5],this.lightList[i+6]);
    	this.lights[j].setAmbient(this.lightList[i+7],this.lightList[i+8],this.lightList[i+9],this.lightList[i+10]);
    	this.lights[j].setDiffuse(this.lightList[i+11],this.lightList[i+12],this.lightList[i+13],this.lightList[i+14]);
    	this.lights[j].setSpecular(this.lightList[i+15],this.lightList[i+16],this.lightList[i+17],this.lightList[i+18]);
        i+=19;
        j++;


    }

    	if(this.lightList[i]=="spot"){
        	if(this.lightList[i+2]==true){
        	this.lights[j].enable()
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
};

XMLscene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup

	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	// Draw axis
	this.axis.display();

	this.setDefaultAppearance();

	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.graph.loadedOk)
	{
		for(var u=0; u<this.nlights; u++){
        this.lights[u].setVisible(true);
        this.lights[u].update();
    }

	};
};
