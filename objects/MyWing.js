function MyWing(scene,x1,y1,z1,x2,y2,z2,x3,y3,z3) {
    CGFobject.call(this, scene);
    this.orient = new MyTriangle(scene,x1,y1,z1,x2,y2,z2,x3,y3,z3);
    this.orient2= new MyTriangle(scene,x1,y1,z1,x3,y3,z3,x2,y2,z2);
};

MyWing.prototype = Object.create(CGFobject.prototype);
MyWing.prototype.constructor = MyWing;


MyWing.prototype.display = function () {
	this.scene.pushMatrix();
	this.orient.display();
	
	this.orient2.display();
	this.scene.popMatrix();

    
};