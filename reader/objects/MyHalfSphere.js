function MyHalfSphere(scene, slices) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;
	this.ang= 2*Math.PI/this.slices;
 	this.initBuffers();
 };

 MyHalfSphere.prototype = Object.create(CGFobject.prototype);
 MyHalfSphere.prototype.constructor = MyHalfSphere;

 MyHalfSphere.prototype.initBuffers = function() {

 	this.vertices=[];
 	this.indices=[];
 	this.normals=[];
 	
 	this.vertices.push(0,0,0.75);
 	this.normals.push(0,1,0);
 	for(var i=0; i < this.slices;i++){

 	
 	this.vertices.push(Math.cos(ang),Math.sin(ang), 0);
 
 	this.normals.push(Math.cos(ang),Math.sin(ang),0);
 	
	
 	
 	
 	
 	ang+=this.ang;
 	
}
for(var j=1;j<this.slices+1;j++){
	if(j==this.slices)
		this.indices.push(j,1,0);
	else
	this.indices.push(j,j+1,0);
}


 
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };