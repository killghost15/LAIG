function DSXnode(scene){
  this.children=[];
  this.texture;
  this.material;
  this.primitive;
  this.matrix=mat4.create();
  this.args=[];
  this.cena=scene;
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
  this.matrix = mat;
};

DSXnode.prototype.setArgs = function (args) {
  this.args = args;
};

DSXnode.prototype.setActiveMaterial = function (material) {
  for(var i = 0; i < this.cena.builtMaterials.length; i += 2){
    if(this.material == this.cena.builtMaterials[i]){

      for(var j = 0; j < this.cena.builtTextures.length; j += 4){
      
        if(this.texture == this.cena.builtTextures[j]){

        console.log(material);
        
         this.cena.builtMaterials[i+1].setTexture(this.cena.builtTextures[j+1]);
       
          this.cena.builtMaterials[i+1].apply();

        }
      }
    }
  }
};

DSXnode.prototype.display = function (scene, material, M) {

  var trans_matrix = mat4.create();
  var boolean = true;
  mat4.multiply(trans_matrix, this.matrix,M);
  scene.multMatrix(trans_matrix);
  
  if(this.material != "inherit"){
    material = this.material;
  }
    for(var i = 0; i <scene.builtPrimitives.length; i += 2){
      if(this.primitive == scene.builtPrimitives[i]){
        this.setActiveMaterial(material);
        scene.builtPrimitives[i+1].display();
        
      }
    }
  
    for(var i = 0; i < this.children.length; i++){
    scene.pushMatrix();
    console.log(this.children.length);
      scene.graph.nodes[this.children[i]].display(scene,material,scene.graph.nodes[this.children[i]].matrix);
      scene.popMatrix();
    }
  
};
