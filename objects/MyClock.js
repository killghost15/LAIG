/**
 * MyClock
 * @constructor
 */
 function MyClock(scene, slices, stacks) {
 	CGFobject.call(this,scene);
	this.cylinder = new MyCylinder(scene,slices,stacks);
	this.clockface=new MyClockFace(scene,slices);
	this.materialDefault = new CGFappearance(this.scene);
	this.clockAppearance=new CGFappearance(this.scene);
	
	this.clockAppearance.setDiffuse(0.4,0.4,0.4,1);
	this.clockAppearance.setSpecular(0.8,0.8,0.8,1);	
	this.clockAppearance.setShininess(150);
	this.clockAppearance.loadTexture("../resources/images/clock.png");
	this.hand=new MyClockHand(scene,1);
	this.hand.setAngle(Math.PI/2);
	this.minutes=new MyClockHand(scene,0.7);
	this.minutes.setAngle(Math.PI);
	this.materialMinutes=new CGFappearance(this.scene);
	this.materialMinutes.setDiffuse(0.7,0.4,0.4,1);
	this.materialMinutes.setSpecular(0.8,0.4,0.4,1);
	this.second=new MyClockHand(scene,0.5);
	this.second.setAngle(3*Math.PI/2);
	this.materialseconds=new CGFappearance(this.scene);
	this.materialseconds.setDiffuse(0.4,0.4,0.9,1);
	this.materialseconds.setSpecular(0.4,0.4,0.9,1);
 };

 MyClock.prototype = Object.create(CGFobject.prototype);
 MyClock.prototype.constructor = MyClock;

MyClock.prototype.update=function(currTime){
	this.second.setAngle(this.second.getAngle()+ Math.PI/30);
	this.minutes.setAngle(this.minutes.getAngle()+Math.PI/(30*60));
	this.hand.setAngle(this.hand.getAngle()+Math.PI/(30*60*12));

} 

 MyClock.prototype.display = function () {
 	this.scene.pushMatrix();
		this.materialDefault.apply();
		this.cylinder.display();
		this.clockAppearance.apply();
		this.scene.translate(0, 0, 1);
		this.clockface.display();
				
		this.materialDefault.apply();
		this.hand.display();
		
		
		this.materialMinutes.apply();
		this.scene.translate(0, 0, 0.01);
		this.minutes.display();
		this.scene.translate(0, 0, 0.01);
		
		this.materialseconds.apply();
		this.second.display();
	

	this.scene.popMatrix();
 };