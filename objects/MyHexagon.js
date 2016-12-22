/**
 * MyHexagon
 * @constructor
 */

 
function MyHexagon(scene, texture, highlightTexture) {
    CGFobject.call(this ,scene);

    /* Equilatric Triangle */

    this.texture = texture;
    this.highlightTexture = highlightTexture;

    this.highlighted = false;

    
    this.myTriangle = new MyTriangle(scene, new MyPosition(0, 0, 0),  new MyPosition(1, 0, 0), new MyPosition(0.5, Math.sqrt(0.75), 0));

    this.myTriangle.initBuffers();
};

MyHexagon.prototype = Object.create(CGFobject.prototype);
MyHexagon.prototype.constructor = MyHexagon;

MyHexagon.prototype.highlight = function() {
    this.highlighted = true;
};

MyHexagon.prototype.lowlight = function() {
    this.highlighted = false;
}

MyHexagon.prototype.display = function() {
    var currentTexture;
    if(this.highlighted)
        currentTexture = this.highlightTexture;
    else
        currentTexture = this.texture;

    for(var i = 0; i < 6; i++){
        this.scene.pushMatrix();

            currentTexture.bind();
            this.scene.rotate((Math.PI/3) * i, 0, 0, 1);

            this.myTriangle.display();

            currentTexture.unbind();

        this.scene.popMatrix();
    }

};