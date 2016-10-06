var degToRad = Math.PI /180.0;



function MyDrone(scene) {
	CGFobject.call(this,scene);
	this.body=new MyBody(scene);
	this.base=new MyBase(scene);
	this.center=new MySemiSphere(scene,50,20);
	this.helice1=new MyHelice(scene);
	this.helice2 =new MyHelice(scene);
	this.helice3=new MyHelice(scene);
	this.helice4=new MyHelice(scene);
	this.perna1=new MyLeg(scene);
	this.perna2=new MyLeg(scene);
	this.selectapp=0;
	this.war=new CGFappearance(this.scene);
	this.war.loadTexture("../resources/images/warthog.png");
	this.war.setSpecular(0.5,0.5,0.5,1);
	this.pixel=new CGFappearance(this.scene);
	this.pixel.loadTexture("../resources/images/pixel.jpg");
	this.pixel.setSpecular(0.5,0.5,0.5,1);
	this.pixel.setShininess(200);
	this.urban=new CGFappearance(this.scene);
	this.urban.loadTexture("../resources/images/urban.jpg");
	this.leg=new CGFappearance(this.scene);
	this.leg.loadTexture("../resources/images/helmet.jpg");
	this.curve=new MyCurve(scene,20,0,1,0,1);
	
	this.speed1=-20;
	this.speed2=20;
	this.speed3=-20;
	this.speed4=20;
};


MyDrone.prototype = Object.create(CGFobject.prototype);
MyDrone.prototype.constructor=MyDrone;
MyDrone.prototype.changeApp=function(num){
	this.selectapp=num;
}
MyDrone.prototype.changespeed=function(speed1,speed2,speed3,speed4){
	if(speed1!=0)
	this.speed1=speed1;
if(speed2!=0)
	this.speed2=speed2;
if(speed3!=0)
	this.speed3=speed3;
if(speed4!=0)
	this.speed4=speed4;
}

MyDrone.prototype.update=function(currTime){
	
	
	this.helice1.update(currTime,this.speed1);
	this.helice2.update(currTime,this.speed2);
	this.helice3.update(currTime,this.speed3);
	this.helice4.update(currTime,this.speed4);

}
MyDrone.prototype.display = function () {
	//Cross 
	this.scene.pushMatrix();
	if(this.selectapp==0){
		this.urban.apply();
	}
	if(this.selectapp==1){
		this.pixel.apply();
	}
	this.body.display();
	this.scene.popMatrix();

	//pillars for helice
	this.scene.pushMatrix();
	if(this.selectapp==0){
		this.urban.apply();
	}
	if(this.selectapp==1){
		this.pixel.apply();
	}
	this.base.display();
	this.scene.popMatrix();
	//halfsphere center
	this.scene.pushMatrix();
	this.scene.rotate(-90*degToRad,1,0,0);
	this.scene.scale(0.7,0.7,0.7); 
	
	this.scene.translate(0,0,-0.25);
	if (this.selectapp==0){
		this.war.apply();
	}
	if(this.selectapp==1){
		this.pixel.apply();
	}

	this.center.display();
	this.scene.popMatrix();

	//helice 1
	this.scene.pushMatrix();
	this.scene.translate(1.15,0.6,1.15);
	this.helice1.display();
	this.scene.popMatrix();

	//helice 2
	this.scene.pushMatrix();
	this.scene.translate(-1.15,0.6,-1.15);
	this.helice2.display();
	this.scene.popMatrix();

	//helice 3
	this.scene.pushMatrix();
	this.scene.translate(-1.15,0.6,1.15);
	this.helice3.display();
	this.scene.popMatrix();

	//helice 4
	this.scene.pushMatrix();
	this.scene.translate(1.15,0.6,-1.15);
	this.helice4.display();
	this.scene.popMatrix();

	//perna 1
	this.scene.pushMatrix();
	if(this.selectapp==0){
		this.urban.apply();
	}
	if(this.selectapp==1){
		this.leg.apply();
	}

	this.scene.translate(0,-1,0.5);
	this.perna1.display();
	this.scene.popMatrix();

	//perna 2
	this.scene.pushMatrix();
	
	this.scene.translate(0,-1,-0.5);
	this.perna2.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.rotate(90*degToRad,1,0,0);
	this.scene.scale(1,0.5,0.5);
	this.scene.translate(0,2,0);
	this.curve.display();
	this.scene.popMatrix();



	this.scene.pushMatrix();
	this.scene.rotate(270*degToRad,1,0,0);
	this.scene.scale(1,0.5,0.5);
	this.scene.translate(0,2,0);
	this.curve.display();
	this.scene.popMatrix();

	


	

	
};
