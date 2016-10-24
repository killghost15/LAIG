function MyCilinder(scene,base,top,height ,slices, stacks) {
 	CGFobject.call(this,scene);


	this.cilinder = new MyCylinder(scene,slices,stacks);
 };

 MyCilinder.prototype = Object.create(CGFobject.prototype);
 MyCilinder.prototype.constructor = MyCilinder;

 MyCilinder.prototype.display = function() {
 	this.cilinder.display();
 	
 };