/**
 * MyBody
 * @constructor
 */

var degToRad = Math.PI /180.0;

 function MyBody(scene) {
 	CGFobject.call(this,scene);
	this.cylinder1 = new MyCylinder(scene,20,50);
	this.cylinder2 = new MyCylinder(scene, 20,50);
	
 };

 MyBody.prototype = Object.create(CGFobject.prototype);
 MyBody.prototype.constructor = MyBody;

 MyBody.prototype.display = function() {
 	this.scene.pushMatrix();
 	this.scene.rotate(-45*degToRad,0,1,0);
 	this.scene.scale(0.2,0.2,3);
 	this.scene.translate(0,0,-0.5);
 	this.cylinder1.display();
 	this.scene.popMatrix();

 	this.scene.pushMatrix();
 	this.scene.rotate(-135*degToRad,0,1,0);
 	this.scene.scale(0.2,0.2,3);
 	this.scene.translate(0,0,-0.5);
 	this.cylinder2.display();
 	this.scene.popMatrix();
};