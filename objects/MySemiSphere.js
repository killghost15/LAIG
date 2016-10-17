/**
 * MySemiSphere
 * @constructor
 */
 function MySemiSphere(scene, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;
	this.stacks = stacks;

 	this.initBuffers();
 };

 MySemiSphere.prototype = Object.create(CGFobject.prototype);
 MySemiSphere.prototype.constructor = MySemiSphere;

 MySemiSphere.prototype.initBuffers = function() {

	var xCoord = 1;
	var yCoord = 0;
	var zCoord = 0;
	var ang = 0;
	var zAng = 0;
	var radius = 1;
	var dAng = 2 * Math.PI / this.slices;
	var dZAng = ( Math.PI / 2) / this.stacks;
	var counter = 0;

 	this.vertices = [];
 	this.indices = [];
	this.normals = [];
	this.texCoords = [];

 	for(var j = -1; j < this.stacks; j++) {
 		console.debug(counter);
 		if( j + 1 == this.stacks ) {

			this.vertices.push( 0, 0, 1 );
			this.normals.push( 0, 0, 1 );
			this.texCoords.push( 0.5, 0.5 );

			for(var i = 0; i < this.slices; i++) {
				console.debug("Counter: " + counter);
				console.debug("2 arg: " + (counter - this.slices + i));
				console.debug("3 arg: " + (counter - this.slices + i + 1));
				if( i == this.slices - 1)
					this.indices.push(counter, counter - this.slices + i, counter - this.slices);
				else
					this.indices.push(counter, counter - this.slices + i, counter - this.slices + i + 1);

			}

			counter++;
 		}
 		else {
			for (var i = 0; i < this.slices; i++) {
				this.vertices.push(xCoord * radius, yCoord * radius, zCoord);
				this.normals.push(radius*Math.cos(ang), radius*Math.sin(ang), zCoord);
				this.texCoords.push((xCoord * radius) / 2 + 0.5, (yCoord * radius) / 2 + 0.5);

				if( counter >= 2 * this.slices - 1 && (counter + 1) % this.slices == 0) {
					
					this.indices.push(counter - this.slices, counter - 2 * this.slices + 1, counter);
					this.indices.push(counter - this.slices + 1, counter, counter - 2 * this.slices + 1);
				} else if( counter >= this.slices ) {

					this.indices.push(counter - this.slices, counter - this.slices + 1, counter);
					this.indices.push(counter + 1, counter, counter - this.slices + 1);
				}

				ang += dAng;

				yCoord = Math.sin(ang);
				xCoord = Math.cos(ang);

				counter++;

			}
		}

		ang = 0;		
		zAng += dZAng;

		xCoord = 1;
		yCoord = 0;
		zCoord = Math.sin(zAng);
		radius = Math.cos(zAng);
	}

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };