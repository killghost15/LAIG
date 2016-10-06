function DSXnode(scene){
  this.sub_nodes=[];
  this.texture=null;
  this.material=null;
  this.base_matrix=mat4.create();
  this.tran_matrix=mat4.create();
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

DSXnode.prototype.setMatrix = function (mat) {
  this.base_matrix = mat4.clone(mat);
};

DSXnode.prototype.transformMatrix = function (mat) {
  mat4.multiply(mat, this.base_matrix, this.tran_matrix);
};
