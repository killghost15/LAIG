function DSXnode(scene){
  this.children=[];
  this.texture;
  this.materials=[];
  this.material;
  this.primitives=[];
  this.matrix=mat4.create();
  this.args=[];
  this.cena=scene;
  this.n=0;
}

DSXnode.prototype.addChild = function (id) {
  this.children.push(id);
};

DSXnode.prototype.setTex = function (id) {
  this.texture = id;
};

DSXnode.prototype.addMaterial = function (id) {
  this.materials.push(id);
};

DSXnode.prototype.addType = function (id) {
  this.primitives.push(id);
};

DSXnode.prototype.setMatrix = function (mat) {
  this.matrix = mat;
};

DSXnode.prototype.setArgs = function (args) {
  this.args = args;
};
//Função que faz a aplicação do material e da textura ao material
DSXnode.prototype.setActiveMaterial = function (material) {
  for(var i = 0; i < this.cena.builtMaterials.length; i += 2){
    if(material == this.cena.builtMaterials[i]){

      for(var j = 0; j < this.cena.builtTextures.length; j += 4){
      
        if(this.texture == this.cena.builtTextures[j]){
        
          this.cena.builtMaterials[i+1].setTexture(this.cena.builtTextures[j+1]);
       
          this.cena.builtMaterials[i+1].apply();
          
        }
      }
    }
  }
};
// permite à interface mudar o material para o proximo da lista de materiais
DSXnode.prototype.changeMaterialNode=function(){
	this.n+=1;
	if(this.n>=this.materials.length)
		this.n=0;

}
//faz o display do node com a sua textura, material e matriz de acordo com os argumentos "none" ou "inherit" utiliza nenhum material ou o do pai respectivamente
DSXnode.prototype.display = function (scene, materialP, M) {

  var trans_matrix = mat4.create();
  var boolean = true;
  this.material=this.materials[this.n];
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
  if(this.material=="none"){
  	this.material=null;
  }
  for(var j=0;j<this.primitives.length;j++){
    for(var i = 0; i <scene.builtPrimitives.length; i += 2){
      if(this.primitives[j] == scene.builtPrimitives[i]){
        this.setActiveMaterial(this.material);
        scene.builtPrimitives[i+1].display();
        
      }
  }

    }
  
};
