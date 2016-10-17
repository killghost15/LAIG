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
  for(var i = 0; i < scene.materialList.length; i += 2){
    if(this.material == scene.materialList[i]){
      for(var j = 0; j < scene.texturesList.length; j += 4){
        if(this.texture == scene.texturesList[j]){
          scene.materialList[m_index].setTexture(scene.texturesList[j+1]);
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
  setActiveMaterial(material);
  if(this.children.length == 0){
    scene.pushMatrix();
    scene.multMatrix(this.trans_matrix);
    //Check primitive, give it a mat and tex then draw
  }else{
    for(var i = 0; i < this.children.length; i++;){
      this.children[i].display(scene, material, M);
    }
  }
};
