function DSXnode(scene){
  this.sub_nodes=[];
  this.texture=null;
  this.material=null;
  this.drawtype=null;
  this.base_matrix=mat4.create();
  this.tran_matrix=mat4.create();
  this.args=null;
}

DSXnode.prototype.addNode = function (id) {
  this.sub_nodes.push(id);
};

DSXnode.prototype.setTexture = function (id) {
  this.texture = id;
};

DSXnode.prototype.setMaterial = function (id) {
  this.material = id;
};

DSXnode.prototype.setType = function (id) {
  this.drawtype = id;
};

DSXnode.prototype.setMatrix = function (mat) {
  this.base_matrix = mat4.clone(mat);
};

DSXnode.prototype.transformMatrix = function (mat) {
  mat4.multiply(mat, this.base_matrix, this.tran_matrix);
};

DSXnode.prototype.setArgs = function (args) {
  this.args = args;
};

DSXnode.prototype.show = function (scene) {
  /* Temporary stubs to check for object type.
  Will be moved to a better place when function is implemented */
  switch(this.drawtype){
    case "tri":

    break;
    case "quad":

    break;
    case "circle":

    break;
    case "prism":

    break;
    case "cylinder":

    break;
    default:
    console.log("Unsupported object type");
  }
  if(this.material != null){
    for(var i = 0; i < scene.materials /*May have to change this*/; i++){
      if(this.material == scene.materials[i]){
        for(var j = 0; j < scene.textures /*This too*/; j++){
          if(this.texture == scene.textures[j]){
            //TODO start drawing
          }
        }
      }
    }
  }
};
