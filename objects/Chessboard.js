function Chessboard(scene,  dU, dV, textureref, sU, sV,colorPoints) {
 	CGFobject.call(this,scene);
	this.dU = dU; 
	this.dV = dV; 
	this.textureref = textureref;
	this.sU = sU;
	this.sV = sV;
	this.colorPoints=colorPoints;
	console.log(this.colorPoints);

	this.partsU = dU * 4;
	var dimX=1;
	var dimY=1;
	this.time = 0;
	this.partsV = dV * 4;
	this.board = new Plane(this.scene, dimX, dimY, this.partsU, this.partsV);
	this.shader = new CGFshader(this.scene.gl, "Shaders/board.vert", "Shaders/board.frag");

	this.material = new CGFappearance(this.scene);

	for(var i=0;i<this.scene.builtTextures.length; i += 4){
		if(this.scene.builtTextures[i]==this.textureref)
			this.material.setTexture( this.scene.builtTextures[i+1]);
}


	this.shader.setUniformsValues({dU: this.dU});
	this.shader.setUniformsValues({dV: this.dV});
	this.shader.setUniformsValues({sU: this.sU});
	this.shader.setUniformsValues({sV: this.sV});

	this.shader.setUniformsValues({c1: this.colorPoints[0]});
	this.shader.setUniformsValues({c2: this.colorPoints[1]});
	this.shader.setUniformsValues({cs: this.colorPoints[2]});

	
 };

 Chessboard.prototype = Object.create(CGFobject.prototype);
 Chessboard.prototype.constructor = Chessboard;

 Chessboard.prototype.display = function() {
 	this.material.apply();

	this.scene.setActiveShader(this.shader);
	this.board.display();
	this.scene.setActiveShader(this.scene.defaultShader);

 };
 Chessboard.prototype.update = function(dSec) {
 	if( this.sU == -1 || this.sV == -1 )
		return;

	this.time += dSec || 0.0;
	var NEXT = 0.1;
	// Every NEXT seconds change the selected piece's position
	if( this.time >= NEXT) {
		this.time -= NEXT;

		if(this.sU == this.dU - 1) {
			this.sU = 0;
			if( this.sV == this.dV - 1) 
				this.sV = 0
			else
				this.sV++;
		} else
			this.sU++;
			
		this.shader.setUniformsValues({dU: this.dU});
	this.shader.setUniformsValues({dV: this.dV});
	this.shader.setUniformsValues({sU: this.sU});
	this.shader.setUniformsValues({sV: this.sV});

	this.shader.setUniformsValues({c1: this.colorPoints[0]});
	this.shader.setUniformsValues({c2: this.colorPoints[1]});
	this.shader.setUniformsValues({cs: this.colorPoints[2]});
	}
 };