/**
 * MyTriangle
 * @param id                id of the triangle
 * @param scene             scene of the triangle
 * @param vertix1           2D coordinate of the vertix 1 of the triangle
 * @param vertix2           2D coordinate of the vertix 2 of the triangle
 * @param vertix3           2D coordinate of the vertix 3 of the triangle
 * @param minS              minimum S of the texture
 * @param maxS              maximum S of the texture
 * @param minT              minimum T of the texture
 * @param maxT              maximum T of the texture
 * @constructor
 */
function MyTriangle(scene, vertix1, vertix2, vertix3) {
     CGFobject.call(this,scene);

    this.vertix1 = vertix1 || new MyPosition(0, 0, 0);
    this.vertix2 = vertix2 || new MyPosition(1, 0, 0);
    this.vertix3 = vertix3 || new MyPosition(0, 1, 0);

    this.initBuffers();
};

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor=MyTriangle;

/**
 * Initiate the buffers of the triangle 
 */
MyTriangle.prototype.initBuffers = function () {
    this.vertices = [
        this.vertix1.x, this.vertix1.y, this.vertix1.z,
        this.vertix2.x, this.vertix2.y, this.vertix2.z,
        this.vertix3.x, this.vertix3.y, this.vertix3.z,
    ];

    this.indices = [
        0, 1, 2,
    ];

    
    /* Calculate deltas for normals */
    var vector1 = vec3.fromValues(this.vertix1.x, this.vertix1.y, this.vertix1.z);
    var vector2 = vec3.fromValues(this.vertix2.x, this.vertix2.y, this.vertix2.z);
    var vector3 = vec3.fromValues(this.vertix3.x, this.vertix3.y, this.vertix3.z);

    var norm = this.calculateNormal(vector1, vector2, vector3);

    this.normals = [
        norm[0], norm[1], norm[2],
        norm[0], norm[1], norm[2],
        norm[0], norm[1], norm[2]
    ];

    var vector12 = vec3.create();
    vec3.sub(vector12, vector2, vector1);

    var vector23 = vec3.create();
    vec3.sub(vector23, vector3, vector2);

    var vector13 = vec3.create();
    vec3.sub(vector13, vector3, vector1);

    var sp3 = (vec3.squaredLength(vector13) + vec3.squaredLength(vector12) - vec3.squaredLength(vector23)) / (2* vec3.length(vector12));
    var tp3 = Math.sqrt(vec3.squaredLength(vector13) - (sp3*sp3));

    this.baseTexCoords = [
        0, 0,
        vec3.length(vector12), 0,
        sp3, tp3,

    ]

    this.texCoords = this.baseTexCoords;

    this.primitiveType=this.scene.gl.TRIANGLES;

    this.initGLBuffers();
};

/**
 * Calculate the normal to a triangle surface
 * @param vector1   vector 1 of the triangle
 * @param vector2   vector 2 of the triangle
 * @param vector3   vector 3 of the triangle
 */
MyTriangle.prototype.calculateNormal = function(vector1, vector2, vector3) {
    this.vectorU = vec3.create();
    this.vectorV = vec3.create();
    vec3.subtract(this.vectorU, vector1, vector2);
    vec3.subtract(this.vectorV, vector1, vector3);
    this.vectorDiagonal = vec3.create();
    vec3.subtract(this.vectorDiagonal, vector3, vector2);
    
    var vectorN = vec3.create();
    vec3.cross(vectorN, this.vectorU, this.vectorV);
    vec3.normalize(vectorN, vectorN);

    return vectorN;
}

/**
 * Update the texture coordinates of the leaf
 * @param amplifS amplify factor S
 * @param amplifT amplify factor T
 */
MyTriangle.prototype.updateTexCoords = function(amplifS, amplifT) {
    for (var i = 0; i < this.texCoords.length; i += 2) {
        this.texCoords[i] = this.baseTexCoords[i] / amplifS;
        this.texCoords[i + 1] = this.baseTexCoords[i+1] / amplifT;
    }

    this.updateTexCoordsGLBuffers();
}