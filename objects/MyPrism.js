/**
 * MyPrism
 * @constructor
 */
 function MyPrism(scene, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;
	this.stacks = stacks;
	this.ang= 2*Math.PI/this.slices;
	this.ang2 = Math.PI/this.slices;
	this.z=1/this.stacks;
 	this.initBuffers();
 };

 MyPrism.prototype = Object.create(CGFobject.prototype);
 MyPrism.prototype.constructor = MyPrism;

 MyPrism.prototype.initBuffers = function() {
 	/*
 	* TODO:
 	* Replace the following lines in order to build a prism with a **single mesh**.
 	*
 	* How can the vertices, indices and normals arrays be defined to
 	* build a prism with varying number of slices and stacks?*/
 	this.vertices=[];
 	this.indices=[];
 	this.normals=[];
 	var z=0;
 	for(var j=0; j < this.stacks;j++){
 		var ang=0;
 	for(var i=0; i < this.slices;i++){

 	this.vertices.push(Math.cos(ang + this.ang),Math.sin(ang+this.ang),z);
 	this.vertices.push(Math.cos(ang),Math.sin(ang), z);
 	this.vertices.push(Math.cos(ang + this.ang),Math.sin(ang+this.ang), z+this.z);
 	this.vertices.push(Math.cos(ang),Math.sin(ang), z+this.z);
 	

 	this.indices.push(2+4*i+j*4*this.slices, j*4*this.slices+4*i+1, j*4*this.slices+4*i);
 	this.indices.push(j*4*this.slices+4*i+2, j*4*this.slices+4*i+3, j*4*this.slices+4*i+1);

 	this.normals.push(Math.cos(this.ang2),Math.sin(this.ang2),0);
 	this.normals.push(Math.cos(this.ang2),Math.sin(this.ang2),0);
 	this.normals.push(Math.cos(this.ang2),Math.sin(this.ang2),0);
 	this.normals.push(Math.cos(this.ang2),Math.sin(this.ang2),0);
 	
 	
 	ang+=this.ang;
 	this.ang2+= this.ang;
}
z=z+this.z;
}
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
