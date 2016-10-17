/**
 * MyCylinder
 * @constructor
 */

 var degToRad = Math.PI /180.0;


 function MyHelice(scene) {
 	CGFobject.call(this,scene);
	this.cylinder =new MyCylinder(scene,6,10);
	this.ang=0;
 	
 };

 MyHelice.prototype = Object.create(CGFobject.prototype);
 MyHelice.prototype.constructor = MyHelice;
 MyHelice.prototype.update=function(currTime,speed){
 	this.ang+=speed;

 }
 MyHelice.prototype.display = function(){
 	this.scene.pushMatrix();
 	
    this.scene.rotate((45+this.ang)*degToRad,0,1,0);
    this.scene.translate(0,0,-0.35);
	this.scene.scale(0.1,0.05,0.7);
	this.cylinder.display();
	this.scene.popMatrix();
 };