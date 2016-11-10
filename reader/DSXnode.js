function DSXnode(scene){
  this.children=[];
  this.texture;
  this.materials=[];
  this.material;
  this.primitives=[];
  this.matrix=mat4.create();
  this.args=[];
  this.cena=scene;
  this.animations=[];
  this.n=0;
  this.builtAnimations=[];
  this.time=0;
  this.timeVector=0;
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
//adiciona o id da animation 
DSXnode.prototype.addAnimation = function(id){
  this.animations.push(id);

  for(var id in this.cena.animationList ){
    if(this.cena.animationList[id]['type']=="linear"){
      this.builtAnimations.push("linear");
      this.builtAnimations.push(0); //time
      this.builtAnimations.push(0); //timevector
      this.builtAnimations.push(0); //nvector
      var animation=new LinearAnimation(this.cena,this.cena.animationList[id]['span'],this.cena.animationList[id]['controlpoints']);
      this.builtAnimations.push(animation);
      
    }
    //#TODO acrescentar a circular animation
    if(this.cena.animationList[id]['type']=="circular"){
      this.builtAnimations.push("circular");
      this.builtAnimations.push(0); //time
      var animation = new CircularAnimation(this.cena,this.cena.animationList[id]['span'],this.cena.animationList[id]['radius'],this.cena.animationList[id]['centerx'],this.cena.animationList[id]['centery'],this.cena.animationList[id]['centerz'],this.cena.animationList[id]['startang'],this.cena.animationList[id]['rotang']);
      this.builtAnimations.push(animation);

    }
  }
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
DSXnode.prototype.updateAnimation=function(currTime){
  for(var i=0;i<this.builtAnimations.length;){
    if(this.builtAnimations[i]=="linear"){
      this.builtAnimations[i+1]+=this.cena.updatePeriod/1000;
      this.builtAnimations[i+2]+=this.cena.updatePeriod/1000;

      if(this.builtAnimations[i+2]>=this.builtAnimations[i+4].duration*this.builtAnimations[i+4].vectors[this.builtAnimations[i+3]].l/this.builtAnimations[i+4].distance){
 
        this.builtAnimations[i+2]=0;
      this.builtAnimations[i+3]=this.builtAnimations[i+3]+1;
      if(  this.builtAnimations[i+3]>=this.builtAnimations[i+4].vectors.length)
      	this.builtAnimations[i+3]=0;
    }

    i+=5;
}
  if(this.builtAnimations[i]=="circular"){
    this.builtAnimations[i+1]+=this.cena.updatePeriod/1000;
    i+=3;
  }
 


}
}

//faz o display do node com a sua textura, material e matriz de acordo com os argumentos "none" ou "inherit" utiliza nenhum material ou o do pai respectivamente
DSXnode.prototype.display = function (scene, materialP, M) {

  var trans_matrix = mat4.create();
  var boolean = true;
  var animation_matrix=mat4.create();
  mat4.identity(animation_matrix);
  this.material=this.materials[this.n];
  mat4.multiply(trans_matrix, this.matrix,M);
  scene.multMatrix(trans_matrix);
	
   for(var g=0;g<this.builtAnimations.length;){
    if(this.builtAnimations[g]=="linear"){
      animation_matrix=this.builtAnimations[g+4].update(this.builtAnimations[g+1],this.builtAnimations[g+2],this.builtAnimations[g+3]);

    g+=5;
  }
  if(this.builtAnimations[g]=="circular"){
   animation_matrix=this.builtAnimations[g+2].update(this.builtAnimations[g+1]);
    g+=3;
  }
  
}
scene.pushMatrix();
scene.multMatrix(animation_matrix);

  
  
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
    scene.popMatrix();
  
};
