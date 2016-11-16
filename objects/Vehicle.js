function Vehicle(scene) {
    CGFobject.call(this, scene);

   

};

Vehicle.prototype = Object.create(CGFobject.prototype);
Vehicle.prototype.constructor = Vehicle;


Vehicle.prototype.display = function () {

    
};