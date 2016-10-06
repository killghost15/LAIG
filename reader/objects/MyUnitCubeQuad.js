function MyUnitCubeQuad(scene) {
	CGFobject.call(this,scene);
	this.quad=new MyQuad(this.scene,0,1,0,1);
	this.quad.initBuffers();
};

MyUnitCubeQuad.prototype = Object.create(CGFobject.prototype);
MyUnitCubeQuad.prototype.constructor=MyUnitCubeQuad;
MyUnitCubeQuad.prototype.display = function(){
var rad = (Math.PI *90)/180;
	var rad2 = (Math.PI*180)/180;
	this.quad.display();
	this.scene.translate(0,0,0);
	this.scene.rotate(rad,0,1,0);
	this.quad.display();
	this.scene.translate(0,0,0);
	this.scene.rotate(rad,0,1,0);
	this.quad.display();
	this.scene.translate(0,0,0);
	this.scene.rotate(rad,0,1,0);
	this.quad.display();
	this.scene.translate(0,0,0);
	this.scene.rotate(rad,1,0,0);
	this.quad.display();
	this.scene.translate(0,0,-1);
	this.scene.rotate(rad2,1,0,0);
	this.scene.translate(0,0,-1);
	this.quad.display();

};
