/**
 * MyCurve
 * @constructor
 */
 function MyCurve(scene, slices,minS, maxS, minT, maxT) {
 	CGFobject.call(this,scene);

    this.minS = minS || 0.0;
    this.maxS = maxS || 1.0;
    this.minT = minT || 0.0;
    this.maxT = maxT || 1.0;
  
	
	this.slices = slices;

 	this.initBuffers();
 };

 MyCurve.prototype = Object.create(CGFobject.prototype);
 MyCurve.prototype.constructor = MyCurve;

 MyCurve.prototype.initBuffers = function() {

	var ang = 0;
	var dAng = Math.PI / this.slices;

	var t = this.minT;
	var dT = (this.maxT - this.minT ) / this.slices;

 	this.vertices = [];
 	this.indices = [];
	this.normals = [];
	this.texCoords = [];

	for (var i = 0; i <= this.slices * 2; i += 2) {

		var yCoord = Math.sin(ang);
		var xCoord = Math.cos(ang);

		this.vertices.push(xCoord, yCoord, 0.5);
		this.vertices.push(xCoord, yCoord, -0.5);

		this.normals.push(xCoord, yCoord, 0);
		this.normals.push(xCoord, yCoord, 0);

		this.texCoords.push(this.minS, t);
		this.texCoords.push(this.maxS, t);

		if( i >= 2 ) {
			// We should be able to see it from both sides
			this.indices.push( i-2, i-1, i );
			this.indices.push( i, i-1, i-2 );
			this.indices.push( i-1, i, i+1 );
			this.indices.push( i+1, i, i-1 );
		}

		ang += dAng;

		t += dT;
	}

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };