/**
 * MyBase
 * @constructor
 */

var degToRad = Math.PI /180.0;

 function MyBase(scene) {
 	CGFobject.call(this,scene);
	this.cylinder1 = new MyCylinder(scene,20,50);
	this.top1=new MySemiSphere(scene,20,50);
	this.top2=new MySemiSphere(scene,20,50);
	this.top3=new MySemiSphere(scene,20,50);
	this.top4=new MySemiSphere(scene,20,50);
	this.cylinder2 = new MyCylinder(scene,20,50);
	this.cylinder3 = new MyCylinder(scene,20,50);
	this.cylinder4 = new MyCylinder(scene,20,50);
 };

 MyBase.prototype = Object.create(CGFobject.prototype);
 MyBase.prototype.constructor = MyBase;

 MyBase.prototype.display = function() {
 	this.scene.pushMatrix();
 	
 	this.scene.pushMatrix();
 	this.scene.rotate(-90*degToRad,1,0,0);
 	this.scene.scale(0.2,0.2,0.7);
 	this.scene.translate(5.8,5.8,-0.25);
 	this.cylinder1.display();
 	
 	this.scene.popMatrix();
 	this.scene.scale(0.2,0.2,0.2);
 	this.scene.rotate(-90*degToRad,1,0,0);
 	this.scene.translate(5.8,5.8,-0.25+2.8);
 	this.top1.display();
 	this.scene.popMatrix();

 	this.scene.pushMatrix();
	this.scene.pushMatrix();
 	this.scene.rotate(-90*degToRad,1,0,0);
 	this.scene.scale(0.2,0.2,0.7);
 	this.scene.translate(5.8,-5.8,-0.25);
 	this.cylinder2.display();
 	this.scene.popMatrix();
 	this.scene.scale(0.2,0.2,0.2);
 	this.scene.rotate(-90*degToRad,1,0,0);
 	this.scene.translate(5.8,-5.8,-0.25+2.8);
 	this.top2.display();
 	this.scene.popMatrix();

 	this.scene.pushMatrix();
 	this.scene.pushMatrix();
 	this.scene.rotate(-90*degToRad,1,0,0);
 	this.scene.scale(0.2,0.2,0.7);
 	this.scene.translate(-5.8,5.8,-0.25);
 	this.cylinder3.display();
 	this.scene.popMatrix();
 	this.scene.scale(0.2,0.2,0.2);
 	this.scene.rotate(-90*degToRad,1,0,0);
 	this.scene.translate(-5.8,5.8,-0.25+2.8);
 	this.top3.display();
 	this.scene.popMatrix();

 	this.scene.pushMatrix();
 	this.scene.pushMatrix()	;
 	this.scene.rotate(-90*degToRad,1,0,0);
 	this.scene.scale(0.2,0.2,0.7);
 	this.scene.translate(-5.8,-5.8,-0.25);
 	this.cylinder4.display();
 	this.scene.popMatrix();

 	this.scene.scale(0.2,0.2,0.2);
 	this.scene.rotate(-90*degToRad,1,0,0);
 	this.scene.translate(-5.8,-5.8,-0.25+2.8);
 	this.top4.display();
 	this.scene.popMatrix();

 };