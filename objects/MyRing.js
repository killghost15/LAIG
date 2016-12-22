/**
 * MyRing
 * @constructor Creates a game ring
 */
function MyRing(scene, type) {
    CGFobject.call(this, scene);

    this.materialID = type;
    if(type == 'white')
    {
        this.textureID = 'whiteTexture';
    }
    else 
    {
        this.textureID='blackTexture';
    }
    

    this.torus = new MyTorus(this.scene, 20, 20);
};

MyRing.prototype = Object.create(CGFobject.prototype);
MyRing.prototype.constructor = MyRing;


MyRing.prototype.display = function() {
    this.scene.pushMatrix();
    var material = this.scene.getMaterialById(this.materialID);
    var texture = this.scene.getTextureById(this.textureID);

    material.apply();
    texture.bind();

    this.torus.display();

    texture.unbind();
    this.scene.popMatrix();
};




