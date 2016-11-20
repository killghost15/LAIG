function Vehicle(scene) {
    CGFobject.call(this, scene);
    this.wings1 = new MyWing(scene,2,1,0,0,0,0,0,0,1);
    this.wings2 = new MyWing(scene,-2,1,0,0,0,0,0,0,1);
    this.body = new MyPrism(scene,4,1);
    this.exhaust;
    var controlpoints=[];
    controlpoints.push(
    						 [ -0.5, -0.5, 0.0],
							 [ -0.75, -1.0, 1.0],
							 [ -0.75,  1.0, 1.0 ],
							 [ -0.5,  0.5, 0.0 ],


							 [ 0, 0, 2.0],
							 [ 0, -1.0, 2.0],
							 [ 0,  1.0, 2.0],
							 [ 0,  0, 2.0],

							 [ 0.5, -0.5, 0.0],
							 [ 0.75, -1.0, 1.0],
							 [ 0.75,  1.0, 1.0],
							 [ 0.5,  0.5, 0.0]);

    this.surface=new Patch(scene,2,3,20,20,controlpoints);

};

Vehicle.prototype = Object.create(CGFobject.prototype);
Vehicle.prototype.constructor = Vehicle;


Vehicle.prototype.display = function () {
	//wings
	this.scene.pushMatrix();
	this.wings1.display();
	this.scene.rotate(Math.PI,0,0,1);
	this.wings1.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.wings2.display();
	this.scene.rotate(Math.PI,0,0,1);
	this.wings2.display();
	this.scene.popMatrix();

	//central part
	this.scene.pushMatrix();
	this.scene.scale(0.5,0.5,0.5);
	this.body.display();
	this.scene.popMatrix();

	//cockpit surface

	this.scene.pushMatrix();
	this.surface.display();
	this.scene.popMatrix();


};
