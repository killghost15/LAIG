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

DSXnode.prototype.setTex = function (id) {
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
    if(material == this.cena.builtMaterials[i]){

      for(var j = 0; j < this.cena.builtTextures.length; j += 4){
      
        if(this.texture == this.cena.builtTextures[j]){
        
          this.cena.builtMaterials[i+1].setTexture(this.cena.builtTextures[j+1]);
       
          this.cena.builtMaterials[i+1].apply();
          console.log( this.cena.builtTextures[j+1]);
        }
      }
    }
  }
};

DSXnode.prototype.display = function (scene, materialP, M) {

  var trans_matrix = mat4.create();
  var boolean = true;
  
  mat4.multiply(trans_matrix, this.matrix,M);
  scene.multMatrix(trans_matrix);
  
  
  
    for(var i = 0; i < this.children.length; i++){
    scene.pushMatrix();
    
      scene.graph.nodes[this.children[i]].display(scene,this.material,this.matrix);
      scene.popMatrix();
    }


    if(this.material == "inherit"){
    this.material = materialP;
  }
  
    for(var i = 0; i <scene.builtPrimitives.length; i += 2){
      if(this.primitive == scene.builtPrimitives[i]){
        this.setActiveMaterial(this.material);
        scene.builtPrimitives[i+1].display();
        
      }

    }
  
};
