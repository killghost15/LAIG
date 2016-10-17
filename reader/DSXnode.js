function DSXnode(scene){
  this.children=[];
  this.texture;
  this.material;
  this.primitive;
  this.matrix=mat4.create();
  this.args=[];
}

DSXnode.prototype.addChild = function (id) {
  this.children.push(id);
};

DSXnode.prototype.setTexture = function (id) {
  this.texture = id;
};

DSXnode.prototype.setMaterial = function (id) {
  this.material = id;
};

DSXnode.prototype.setType = function (id) {
  this.primitive = id;
};

DSXnode.prototype.setMatrix = function (mat) {
  this.matrix = mat4.clone(mat);
};

DSXnode.prototype.setArgs = function (args) {
  this.args = args;
};

DSXnode.prototype.setActiveMaterial = function (material) {
  for(var i = 0; i < scene.builtMaterials.length; i += 2){
    if(this.material == scene.builtMaterials[i]){
      for(var j = 0; j < scene.builtTextures.length; j += 4){
        if(this.texture == scene.texturesList[j]){
          scene.materialList[i+1].setTexture(scene.builtTextures[j+1]);
          scene.materialList[i+1].apply();
        }
      }
    }
  }
};

DSXnode.prototype.display = function (scene, material, M) {
  var trans_matrix = mat4.create();
  mat4.multiply(trans_matrix, M, this.matrix);
  if(this.material != "inherit"){
    material = this.material;
  }
  if(this.children.length == 0){
    for(var i = 0; i < builtPrimitives.length; i += 2){
      if(this.primitive == builtPrimitives[i]){
        scene.pushMatrix();
        scene.multMatrix(this.trans_matrix);
        setActiveMaterial(material);
        builtPrimitives[i+1].display();
        scene.popMatrix();
      }
    }
  }else{
    for(var i = 0; i < this.children.length; i++){
      this.children[i].display(scene, material, M);
    }
  }
};
