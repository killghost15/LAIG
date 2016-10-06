function MyTable(scene) {
	CGFobject.call(this,scene);
	this.cube = new  MyUnitCubeQuad(this.scene);
	this.tableAppearance=new CGFappearance(this.scene);
	this.tableAppearance.setSpecular(0, 0, 0, 1.0);
	this.tableAppearance.setShininess(50);
	this.tableAppearance.setDiffuse(0.7,0.7,0.7,1);
	this.tableAppearance.loadTexture("../resources/images/table.png");

	/*this.legsAppearance=new CGFappearance(this.scene);
	this.legsAppearance.setShininess(100);
	this.legsAppearance.loadTexture("../resources/images/legs.png")*/

	this.materialDefault = new CGFappearance(this.scene);
	};

MyTable.prototype = Object.create(CGFobject.prototype);
MyTable.prototype.constructor=MyTable;
MyTable.prototype.display = function(){

	this.scene.pushMatrix();
	this.materialDefault.apply();
	this.scene.scale(0.3,3.5,0.3);
	this.cube.display();
	this.scene.translate(8,0,0);
	this.cube.display();
	this.scene.translate(0,0,14);
	this.cube.display();
	this.scene.translate(0,0,-8);
	
	this.cube.display();
	this.scene.popMatrix();



    this.scene.pushMatrix();
    this.tableAppearance.apply();
	this.scene.scale(5,0.3,3);
	this.scene.translate(0.42,6,0.4);
	this.cube.display();
	this.scene.popMatrix();

}