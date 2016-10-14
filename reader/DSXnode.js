function DSXnode(scene){
  this.children=[];
  this.texture;
  this.material;
  this.drawtype=null;
  this.matrix=mat4.create();
  this.args=null;
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
  this.drawtype = id;
};

DSXnode.prototype.setMatrix = function (mat) {
  this.matrix = mat4.clone(mat);
};

DSXnode.prototype.setArgs = function (args) {
  this.args = args;
};

DSXnode.prototype.setActiveMaterial = function (material, m_index) {
  if((m_index = scene.materialIdList.indexOf(material)) != -1){
    if((var t_index = scene.textureIdList.indexOf(this.texture)) != -1){
      scene.materiaList[m_index].setTexture(scene.textureList[t_index]);
    }
  }
};

DSXnode.prototype.display = function (scene, material, M) {
  var trans_matrix = mat4.create();
  var m_index = null;
  mat4.multiply(trans_matrix, M, this.matrix);
  if(this.material[0] != "inherit"){
    material = this.material;
  }
  setActiveMaterial(material, m_index);
  if(this.children.length == 0){
    //Push matrix, set material and texture, etc.
    scene.pushMatrix();
    if(m_index >= 0){
      scene.def_app = scene.materialList[m_index];
    }else{
      scene.def_app = scene.fallbackMaterial;
    }
    scene.def_app.apply();
    scene.multMatrix(this.trans_matrix);
    switch(this.drawtype){
      case "triangle":
      var shape = MyTriangle(scene /*ARGS*/);
      break;
      case "rectangle":
      var shape = MyQuad(scene /*ARGS*/);
      break;
      case "cylinder":
      var shape = MyCylinder(scene /*ARGS*/);
      break;
      case "sphere":
      var shape = MySphere(scene /*ARGS*/);
      break;
      case "torus":
      var shape = MyNightmare(scene /*ARGS*/);
      break;
      default:
      console.log(this.drawtype, "is not a supported shape. Use only one of these: triangle, rectangle, cylinder, sphere, torus");
      break;
    }
  }
  for(var i = 0; i < this.children.length; i++;){
    this.children[i].display(scene, material, M);
  }
};
