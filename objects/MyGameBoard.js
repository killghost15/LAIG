/**
 * MyGameBoard
 * @constructor Creates a 2-3-2 hexagonal game board
 */
function MyGameBoard(scene, rows, cols) {
    CGFobject.call(this, scene);

    this.gameColumns = cols + 1;
    this.gameRows = rows + 1;


    // this.myHexagon = new MyHexagon(1, scene);
    this.tiles=[];
    this.tileCoordinates=[];

    this.rings=[];
    this.disks=[];

    this.animationSpan = 3;

    this.animationStartCoords = null;
    this.animationFinalCoords = null;

this.debug=0;
    //holds the ID of the tile that is being animated
    this.animatedStartTile = null;
    this.animatedFinalTile = null;

    this.elapsedAnimationTime = 0;

    this.makeTiles();
};

MyGameBoard.prototype = Object.create(CGFobject.prototype);
MyGameBoard.prototype.constructor = MyGameBoard;

MyGameBoard.prototype.makeTiles = function() {
    var id=0;

    var height = 2;

    var texture = this.scene.getTextureById('BoardTexture');
    var highlightTexture = this.scene.getTextureById('BoardHighlightTexture');
    var x_coord = -9;
    var y_coord = -5;
    for(var i =1;i<this.gameColumns;i++) {
        for (var j = 1; j < this.gameRows; j++) {
            this.tiles.push(new MyHexagon(this.scene, texture, highlightTexture));
            id++;
            x_coord+= height;
            this.tileCoordinates.push(new MyCoordinate(x_coord, y_coord));
        }
        y_coord += height*Math.sqrt(0.75);
        x_coord = -9 + i *height/2;
    }
};


MyGameBoard.prototype.display = function() {

    /* 2-3-2 hexagonal game board */

    //var height = 2;
    //var x_coord = -9;
    //var y_coord = -5;
    var id=0;
    var material = this.scene.getMaterialById('boardMat');
    for(var i =1;i<this.gameColumns;i++){
        for(var j=1;j<this.gameRows;j++){
            this.scene.pushMatrix();
                material.apply();
                var coordinates = this.getCoordsByTileID(id);
                this.scene.translate(coordinates.x,coordinates.y, 0);

                this.scene.pushMatrix();
                    this.scene.rotate(Math.PI/2, 0, 0, 1);
                    this.scene.registerForPick(id+1,this.tiles[id]);

                    texture = this.scene.getTextureById('star');
                    texture.bind();

                    this.tiles[id].display();

                    texture.unbind();

                this.scene.popMatrix();

                this.scene.translate(0, 0, 0.15);

                this.displayTile(id);

            this.scene.popMatrix();
            id++;
        }
    }
};

MyGameBoard.prototype.displayTile = function(tileID) {

    if(this.rings[tileID] == null && this.disks[tileID] == null)
        return;
    if(this.animatedStartTile == tileID && this.animatedStartTile != null){
        
        this.animate();
    }
    
    if(this.rings[tileID] != null){
        this.rings[tileID].display();
    }


    if(this.disks[tileID] != null)
        this.disks[tileID].display();

}

MyGameBoard.prototype.placeRing = function(tileID, type) {
    this.rings[tileID] = new MyRing(this.scene, type);
};

MyGameBoard.prototype.placeDisk = function(tileID, type) {
    this.disks[tileID] = new MyDisk(this.scene, type);
};

MyGameBoard.prototype.moveToTile = function(initialTile, finalTile) {
    var initialCoords = this.getCoordsByTileID(initialTile);
    var finalCoords = this.getCoordsByTileID(finalTile);

    this.animationStartCoords = initialCoords;
    this.animationFinalCoords = finalCoords;

    this.animatedStartTile = initialTile;
    this.animatedFinalTile = finalTile;
};



MyGameBoard.prototype.animate = function() {
    console.log('animating');
    this.elapsedAnimationTime += this.scene.elapsedTime;

    if(this.elapsedAnimationTime >= this.animationSpan){
        //Board Tile
        if(this.rings[this.animatedStartTile] != null)
            this.rings[this.animatedFinalTile] = this.rings[this.animatedStartTile];

        if(this.disks[this.animatedStartTile] != null)
            this.disks[this.animatedFinalTile] = this.disks[this.animatedStartTile];

        this.rings[this.animatedStartTile] = null;
        this.disks[this.animatedStartTile] = null;


        this.finishAnimation();
        return;
    }

    var zStart = 0;
    var zMax = 3.85;

    var startVector = vec3.fromValues(this.animationStartCoords.x, this.animationStartCoords.y, zStart);
    var endVector = vec3.fromValues(this.animationFinalCoords.x, this.animationFinalCoords.y, zMax);


    var distanceVector = vec3.create();
    vec3.subtract(distanceVector, endVector, startVector);

    var percentageAnimated = this.elapsedAnimationTime / this.animationSpan;

    var percentageZ = percentageAnimated;
    if(percentageAnimated >= 0.5)
        percentageZ = 1 - percentageAnimated;

    var tempVector = vec3.fromValues(percentageAnimated, percentageAnimated, percentageZ);

    var translationVector = vec3.create();
    vec3.multiply(translationVector, distanceVector, tempVector);

    this.scene.translate(translationVector[0], translationVector[1], translationVector[2]);
    return;
};

MyGameBoard.prototype.finishAnimation = function() {
    this.animationStartCoords = null;
    this.animationFinalCoords = null;


    this.animatedStartTile = null;
    this.animatedFinalTile = null;

    this.elapsedAnimationTime = 0;

    this.scene.gameEngine.nextState();

};

MyGameBoard.prototype.getCoordsByTileID = function(tileID) {
    var i = Math.floor( tileID  / 7);
    var j = tileID % 7;
    var x = -9;
    var y = -5;
    var height = 2;

    x += j * height;
    x += i * height / 2;
    y += i * height * Math.sqrt(0.75);

    return new MyCoordinate(x, y);
};

MyGameBoard.prototype.isEmpty = function(){
    if(this.rings.length > 0)
        return false;

    if(this.disks.length > 0)
        return false;

    return  true;
}