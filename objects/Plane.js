function Plane(scene, dimX, dimY,partsX,partsY) {
 	CGFobject.call(this,scene);
 	this.surface=new Patch(scene,1,1,partsX,partsY);
 	this.dimX=dimX;
 	this.dimY=dimY;
	
	
 };

 Plane.prototype = Object.create(CGFobject.prototype);
 Plane.prototype.constructor = Plane;

 Plane.prototype.display = function() {
 	this.scene.scale(this.dimX,1,this.dimY);
 	this.surface.display();

 };