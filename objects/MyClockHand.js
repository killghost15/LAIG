/**
 * MyClockHand
 * @constructor
 */
 function MyClockHand(scene,sy) {
 	CGFobject.call(this,scene);
	this.quad=new MyQuad(scene,0, 1, 0, 1);
this.sy=sy;
this.ang=0;
 	this.initBuffers();
 };

 MyClockHand.prototype = Object.create(CGFobject.prototype);
 MyClockHand.prototype.constructor = MyClockHand;
MyClockHand.prototype.getAngle=function(){
	return this.ang;
}
MyClockHand.prototype.setAngle=function(angle){
	this.ang=angle;

};
MyClockHand.prototype.display=function(){
	this.scene.pushMatrix();
	this.scene.rotate(-this.ang,0,0,1);
	this.scene.scale(0.05,this.sy,1);
	this.scene.translate(0,0.4,0);
	this.quad.display();
	this.scene.popMatrix();

 };