function Patch(scene,orderU, orderV,partsU, partsV, controlPoints) {
    CGFobject.call(this, scene);

    this.partsU = (partsU == undefined ? 1 : partsU);
    this.partsV = (partsV == undefined ? 1 : partsV);

    this.orderU = (orderU == undefined ? 1 : orderU);
    this.orderV = (orderV == undefined ? 1 : orderV);

    this.knotsU = [];
    for (var i = 0; i < (this.orderU + 1) * 2; i++) {
        if (i < this.orderU + 1)
            this.knotsU.push(0);
        else
            this.knotsU.push(1);
    }

    this.knotsV = [];
    for (var i = 0; i < (this.orderV + 1) * 2; i++) {
        if (i < this.orderV + 1)
            this.knotsV.push(0);
        else
            this.knotsV.push(1);
    }
//if undefined like in plane,creates a base set with order 0
    this.controlPoints = [];
    if (controlPoints == undefined) {
        this.controlPoints = [[[0.5, -0.5,0.0, 1], [-0.5, -0.5, 0, 1]], [[0.5, 0.5, 0.0, 1], [-0.5, 0.5,0.0, 1]]];
    } else {
        for (i = 0; i < this.orderU + 1; i++) {
            var v = [];
            for (var j = 0; j < this.orderV + 1; j++) {
                v.push([controlPoints[i * (this.orderV + 1) + j][0], controlPoints[i * (this.orderV + 1) + j][1], controlPoints[i * (this.orderV + 1) + j][2], 1]);
            }
            this.controlPoints.push(v);
        }
    }

    var nurbsSurface = new CGFnurbsSurface(this.orderU, this.orderV, this.knotsU, this.knotsV, this.controlPoints);

    var getSurfacePoint = function (u, v) {
        return nurbsSurface.getPoint(u, v);
    };

    this.surface = new CGFnurbsObject(this.scene, getSurfacePoint, this.partsU, this.partsV);

};

Patch.prototype = Object.create(CGFobject.prototype);
Patch.prototype.constructor = Patch;

Patch.prototype.updateTexCoords = function(){};

Patch.prototype.display = function () {
    this.surface.display();
};