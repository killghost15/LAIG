/**
 * MyCircle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyCircle(scene, slices, scaleFact) {
    CGFobject.call(this,scene);

    this.slices = slices || 20;

    this.k = scaleFact;

    this.minS = 0;
    this.maxS = 1;
    this.minT = 0;
    this.maxT = 1;

    this.initBuffers();
};

MyCircle.prototype = Object.create(CGFobject.prototype);
MyCircle.prototype.constructor=MyCircle;

MyCircle.prototype.initBuffers = function () {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    //Scaling factor

    var beta = 2 * Math.PI / this.slices; // Calculate DELTA angle
    var currentAngle = 0, x = 0, y = 0;

    // Calculate circle
    for (var i = 0; i < this.slices; i++) {
        x = Math.cos(currentAngle) * this.k;
        y = Math.sin(currentAngle) * this.k;

        // Vertices
        this.vertices.push(x, y, 0);

        // Normals
        this.normals.push(0, 0, 1);

        // Indices
        if(i + 2 < this.slices)
            this.indices.push(0, i + 1, i + 2);

        // Texture
        x = Math.cos(currentAngle + Math.PI / 2);
        y = Math.sin(currentAngle + Math.PI / 2);
        this.texCoords.push((y + 1) / 2, (x + 1) / 2);

        // Increase angle
        currentAngle += beta;
    }

    this.primitiveType=this.scene.gl.TRIANGLES;

    this.initGLBuffers();
};
