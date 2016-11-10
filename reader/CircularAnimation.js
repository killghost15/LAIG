function CircularAnimation(scene, duration, radius, centerx,centery,centerz, initialAngle, rotationAngle) {
    Animation.call(this, scene, duration, "Circular");

    this.radius = radius;
    this.centerx=centerx;
    this.centery=centery;
    this.centerz=centerz;
    this.initialAngle = initialAngle;
    this.rotationAngle = rotationAngle;

    this.angleVariation = this.rotationAngle / this.duration;
}

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.update = function (time) {

    var angle = Math.PI * (this.initialAngle + this.angleVariation * time) / 180;

    return Animation.prototype.update.call(
        this,
        -angle + Math.PI/2,
        [
            this.centerx + this.radius * Math.cos(angle),
            this.centery,
            this.centerz + this.radius * Math.sin(angle)
        ],
        time
    );

};