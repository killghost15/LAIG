/**
 * MyAuxBoard
 * @constructor Creates a 2-3-2 hexagonal game board
 */
function MyAuxBoard(scene) {
    CGFobject.call(this,scene);

    // this.myHexagon = new MyHexagon(1, scene);
    this.tiles=[];

    this.whiteRing = new MyRing(scene, 'white');
    this.whiteDisk = new MyDisk(scene, 'white');

    this.blackRing = new MyRing(scene, 'black');
    this.blackDisk = new MyDisk(scene, 'black');


    this.animationSpan = 3;

    this.animationStartCoords = null;
    this.animationFinalCoords = null;


    //holds the ID of the tile that is being animated
    this.animatedStartTile = null;
    this.animatedFinalTile = null;

    this.elapsedAnimationTime = 0;

    this.makeTiles();
};

MyAuxBoard.prototype = Object.create(CGFobject.prototype);
MyAuxBoard.prototype.constructor = MyAuxBoard;

MyAuxBoard.prototype.makeTiles = function() {
    var id=0;

    var texture = this.scene.getTextureById('auxTexture');
    var highlightTexture = this.scene.getTextureById('auxHighlightTexture');
    for(var i = 0 ; i < 4; i++){
        this.tiles.push(new MyHexagon(this.scene, texture, highlightTexture));
        id++;
    }


};


MyAuxBoard.prototype.display = function() {

    /* 2-3-2 hexagonal game board */

    var height = 2;
    var x_coord = -10;
    var y_coord = -1;
    var id=this.scene.currentBoard.tiles.length;
    var material = this.scene.getMaterialById('boardMat');

    //Display White Aux
    for(var i=0;i<2;i++){
            this.scene.pushMatrix();
            material.apply();
            this.scene.translate(x_coord,y_coord, 0);
            this.scene.pushMatrix();
                this.scene.rotate(Math.PI/2, 0, 0, 1);
                this.scene.registerForPick(id+1,this.tiles[i]);

                this.tiles[i].display();
            this.scene.popMatrix();

            this.scene.translate(0, 0, 0.15);
            if(this.animatedStartTile == i + 49 && this.animatedStartTile != null){
                this.animate();
            }
            if(i == 0)
                this.whiteRing.display();
            else
                this.whiteDisk.display();

            this.scene.popMatrix();
            y_coord += height*Math.sqrt(0.75);
            x_coord+=height/2;
            id++;

        }

    //Display Black Aux
    x_coord = 8;
    y_coord = -1;

    for(; i < 4; i++){
        this.scene.pushMatrix();
        material.apply();
        this.scene.translate(x_coord,y_coord, 0);
        this.scene.pushMatrix();

            this.scene.rotate(Math.PI/2, 0, 0, 1);
            this.scene.registerForPick(id+1,this.tiles[i]);

            texture = this.scene.getTextureById('BoardTexture');
            texture.bind();

            this.tiles[i].display();

        this.scene.popMatrix();
        texture.unbind();

        this.scene.translate(0, 0, 0.15);
        if(this.animatedStartTile == i + 49 && this.animatedStartTile != null){
            this.animate();
        }
        if(i == 2)
            this.blackRing.display();
        else
            this.blackDisk.display();

        this.scene.popMatrix();
        y_coord += height*Math.sqrt(0.75);
        x_coord+=height/2;
        id++;
    }


};

MyAuxBoard.prototype.moveToTile = function(initialTile, finalTile) {
    var initialCoords = this.getCoordsByTileID(initialTile);
    var finalCoords = this.scene.currentBoard.getCoordsByTileID(finalTile);


    this.animationStartCoords = initialCoords;
    this.animationFinalCoords = finalCoords;

    this.animatedStartTile = initialTile;
    this.animatedFinalTile = finalTile;
};



MyAuxBoard.prototype.animate = function() {
    this.elapsedAnimationTime += this.scene.elapsedTime;

    if(this.elapsedAnimationTime >= this.animationSpan){
        //Board Tile
        var type;
        if(this.animatedStartTile < 2 + 49)
            type = 'white';
        else type = 'black';

        if(this.animatedStartTile % 2)
            this.scene.currentBoard.placeRing(this.animatedFinalTile, type);
        else
            this.scene.currentBoard.placeDisk(this.animatedFinalTile, type);

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

MyAuxBoard.prototype.finishAnimation = function() {
    this.animationStartCoords = null;
    this.animationFinalCoords = null;


    this.animatedStartTile = null;
    this.animatedFinalTile = null;

    this.elapsedAnimationTime = 0;

    this.scene.gameEngine.nextState();
};

MyAuxBoard.prototype.getCoordsByTileID = function(tileID) {
    var x, y;
    switch(tileID){
        case 49:
            x = -10;
            y = -1;
            break;
        case 50:
            y = -1 + 2*Math.sqrt(0.75);
            x = -9;
            break;
        case 51:
            x = 8;
            y = -1;
            break;
        case 52:
            y = -1 + 2*Math.sqrt(0.75);
            x = 9;
            break;
    }

    return new MyCoordinate(x, y);
};
