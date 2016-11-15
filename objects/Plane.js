function Plane(scene, dimX, dimY,partsX,partsY) {
 	CGFobject.call(this,scene);
 	this.surface=new Patch(scene,1,1,partsX,partsY);

	
	
 };

 Plane.prototype = Object.create(CGFobject.prototype);
 Plane.prototype.constructor = Plane;

 Plane.prototype.display = function() {
 	this.scene.scale(dimX,1,dimY);
 	this.surface.display();

 };