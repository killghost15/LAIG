function MyLeg(scene) {
 	CGFobject.call(this,scene);
 	this.curve=new MyCurve(scene,20,0,1,0,1);
 	this.base=new MyCylinder(scene,5,1);
    
 };

 MyLeg.prototype = Object.create(CGFobject.prototype);
 MyLeg.prototype.constructor = MyLeg;

 MyLeg.prototype.display = function() {
this.scene.pushMatrix();
this.scene.scale(0.7,1,0.2);
this.curve.display();


this.scene.popMatrix();
this.scene.pushMatrix();
this.scene.translate(0.5,0,-0.4);
this.scene.scale(0.2,0.2,0.7);
this.base.display();
this.scene.translate(-5,0,0);
this.base.display();
this.scene.popMatrix();
	
 };