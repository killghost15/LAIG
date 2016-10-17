 
 function MySphere(scene, slices, stacks) {
 	CGFobject.call(this,scene);
	this.top= new MySemiSphere(scene,slices,stacks);
	this.down= new MySemiSphere(scene,slices,stacks);
	

 };

MySphere.prototype = Object.create(CGFobject.prototype);
MySphere.prototype.constructor=MySphere;

MySphere.prototype.display=function(){
this.scene.pushMatrix();
this.top.display();
this.scene.scale(1,-1,1);
this.down.display();
this.scene.popMatrix();

};