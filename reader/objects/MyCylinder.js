/**
 * MyCylinder
 * @constructor
 */
 function MyCylinder(scene, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;
	this.stacks = stacks;
	this.ang= 2*Math.PI/this.slices;
	this.z=1/this.stacks;
 	this.initBuffers();
 };

 MyCylinder.prototype = Object.create(CGFobject.prototype);
 MyCylinder.prototype.constructor = MyCylinder;

 MyCylinder.prototype.initBuffers = function() {
 	/*
 	* TODO:
 	* Replace the following lines in order to build a prism with a **single mesh**.
 	*
 	* How can the vertices, indices and normals arrays be defined to
 	* build a prism with varying number of slices and stacks?*/
 	this.vertices=[];
 	this.indices=[];
 	this.normals=[];
 	this.texCoords=[];
 	var z=0;
 	var s=0;
 	var t=0;
 	for(var j=-1; j < this.stacks;j++){
 		var ang=0;
 		s=0;
 	for(var i=0; i < this.slices;i++){

 	
 	this.vertices.push(Math.cos(ang),Math.sin(ang), z);
 
 	this.normals.push(Math.cos(ang),Math.sin(ang),0);
 	this.texCoords.push(s,t);
	
 	
 	
 	
 	s+=1/this.slices;
 	ang+=this.ang;
 	
}
t+=this.z;
z=z+this.z;
}


 	for(var i = 0; i < this.stacks * this.slices; i++) {
 		if ((i+1) % this.slices==0){
 			this.indices.push(i,i-this.slices+1,i+1);
 			this.indices.push(i,i+1,i+this.slices);
 		}

 		else{	
		this.indices.push(i,i+1,i+this.slices+1);
		this.indices.push(i,i+this.slices+1,i+this.slices);}
		}

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };