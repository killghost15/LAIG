/**
 * MyCylinder
 * @param id                id of the scene
 * @param scene             scene of the cylinder
 * @param height            height of the cylinder
 * @param bottom_radius     bottom radius of the cylinder
 * @param top_radius        top radius of the cylinder
 * @param stacks            stacks of the cylinder
 * @param slices            slices of the cylinder
 * @param minS              minimum S of the texture
 * @param maxS              maximum S of the texture
 * @param minT              minimum T of the texture
 * @param maxT              maximum T of the texture
 * @constructor
 */
function MyCylinder(scene, height, bottom_radius, top_radius, stacks, slices, minS, maxS, minT, maxT) {
    CGFobject.call(this,scene);

    this.slices = slices;
    this.stacks = stacks;
    this.height = height;
    this.bottom_radius = bottom_radius;
    this.top_radius = top_radius;

    this.minS = minS || 0;
    this.minT = minT || 0;
    this.maxS = maxS || 1;
    this.maxT = maxT || 1;

    this.initBuffers();
};

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;

/**
 * Initiate the buffers of the cylinder 
 */
MyCylinder.prototype.initBuffers = function() {
    // Arrays
    this.vertices = [];
    this.normals = [];
    this.indices = [];
    this.texCoords = [];

    var circleDeltaAngle = 2 * Math.PI / this.slices,
        deltaHeight = this.height / this.stacks,
        deltaRadius = (this.top_radius - this.bottom_radius) / this.stacks,
        deltaS = (this.maxS - this.minS) / this.slices,
        deltaT = (this.maxT - this.minT) / this.stacks;

    var inclinationAngle = Math.atan((this.bottom_radius - this.top_radius) / this.height); // Inclination of the cylinder surface

    var currentCircleAngle = 0, currentRadius, currentIndice,
        x, y,
        normX, normY, normZ = Math.sin(inclinationAngle),
        s = this.minS, t = this.maxT;

    // Calculate cylinder
    for (var slice = 0; slice <= this.slices; slice++) {
        x = Math.cos(currentCircleAngle);
        y = Math.sin(currentCircleAngle);
        normX = Math.cos(currentCircleAngle);
        normY = Math.sin(currentCircleAngle);

        for(var stack = 0; stack <= this.stacks; stack++) {
            currentRadius = stack * deltaRadius + this.bottom_radius;

            // Vertices
            this.vertices.push(x * currentRadius, y * currentRadius, stack * deltaHeight);

            // Normals
            this.normals.push(normX , normY, normZ);

            this.texCoords.push(s, t);

            t -= deltaT;
        }

        t = this.maxT;
        s += deltaS;

        // Increase angle
        currentCircleAngle += circleDeltaAngle;
    }

    for (var i = 0; i < this.slices; i++) {
        for(var j = 0; j < this.stacks; j++) {
            currentIndice = i * (this.stacks + 1) + j;
            nextIndice = currentIndice + this.stacks + 1;
            this.indices.push(nextIndice, nextIndice + 1, currentIndice + 1);
            this.indices.push(currentIndice, nextIndice, currentIndice + 1);
        }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;

    this.initGLBuffers();
};