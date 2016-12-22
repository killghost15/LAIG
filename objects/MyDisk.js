/**
 * MyDisk
 * @constructor Creates a game ring
 */
function MyDisk(scene, type) {
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

    this.diskBody = new MyCylinder(scene, 0.3, 0.4, 0.4, 20, 20);
    this.diskTop = new MyCircle(scene, 20, 0.4);
};

MyDisk.prototype = Object.create(CGFobject.prototype);
MyDisk.prototype.constructor = MyDisk;


MyDisk.prototype.display = function() {
    this.scene.pushMatrix();
    var material = this.scene.getMaterialById(this.materialID);
    var texture = this.scene.getTextureById(this.textureID);

    material.apply();
    texture.bind();

    this.diskBody.display();

    this.scene.translate(0, 0, 0.3);

    material.apply();
    texture.bind();
    this.diskTop.display();

    texture.unbind();
    this.scene.popMatrix();
};
