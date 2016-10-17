/**
 * MyClockFace
 * @constructor
 */
 function MyClockFace(scene, slices) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;
	this.ang= 2*Math.PI/slices;
 	this.initBuffers();
 };

 MyClockFace.prototype = Object.create(CGFobject.prototype);
 MyClockFace.prototype.constructor = MyClockFace;

 MyClockFace.prototype.initBuffers = function() {
 	this.vertices=[];
 	this.indices=[];
 	this.normals=[];
 	this.texCoords=[];

 	this.vertices.push(0, 0, 0);
	this.normals.push(0, 0, 1);
	this.texCoords.push(0.5, 0.5);

	var ang=0;
 	for(var i=1; i <= this.slices;i++){

 	
 	this.vertices.push(Math.cos(ang),Math.sin(ang), 0);
 
 	this.normals.push(0,0,1);
 	this.texCoords.push((Math.cos(ang)+ 1) / 2, (-Math.sin(ang) + 1) / 2);
	
 	ang+=this.ang;
 	
				if(i == this.slices) {
					this.indices.push(0, i-1, i); //i, 1, 0);
					this.indices.push(i, 1, 0);
				}
				else {
					this.indices.push(0, i-1, i); //i, i-1, 0);
					//this.indices.push(i, i-1, 0);
				}
 	
 	
 	
}

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };