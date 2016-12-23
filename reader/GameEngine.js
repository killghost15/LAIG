/**
 * GameEngine
 * @constructor
 */
function GameEngine(scene) {
    this.gameStates = {
        START : 'START',
        PICK_PLACE_PIECE : 'PICK_PLACE_PIECE',
        PICK_PLACE_TARGET : 'PICK_PLACE_TARGET',
        PLACE_ANIMATION : 'PLACE_ANIMATION',
        PICK_MOVE_PIECE : 'PICK_MOVE_PIECE',
        PICK_MOVE_TARGET : 'PICK_MOVE_TARGET',
        MOVE_ANIMATION : 'MOVE_ANIMATION',
        CHECK_WINNING_CONDITION : 'CHECK_WINNING_CONDITION'
    };

    this.gameState = null;

    this.scene = scene;

    this.currentBoard = null;

    this.availablePlays = null;

    this.players = {
        WHITE : 0,
        BLACK : 1
    }
    this.currentPlayer = null;

    this.pieces = {
        DISK : 0,
        RING : 1
    }

    this.currentPiece = null;

    //Pick is a tileID
    this.lastPick = null;
    this.currentPick = null;

    this.init();

};

GameEngine.prototype.constructor = GameEngine;

GameEngine.prototype.init = function() {
    this.currentPlayer = this.players.WHITE;

    this.gameState = this.gameStates.PICK_PLACE_PIECE;

    var self=this;

    this.initialize(function(tempBoard) {
        self.lastBoard = tempBoard;
        self.currentBoard = tempBoard;
    });

};

GameEngine.prototype.processPicking = function(tileID) {
    switch (this.gameState) {
        case 'PICK_PLACE_PIECE':
            if(tileID <= 48) {
                console.log('Pick a piece to play');
                return;
            }
            if(this.currentPlayer == this.players.WHITE)
                if(tileID >= 51) {
                    console.log('You need to pick a white piece');
                    return;
                }
            if(this.currentPlayer == this.players.BLACK)
                if(tileID <= 50) {
                    console.log('You need to pick a black piece');
                    return;
                }
            if(tileID % 2)
                this.currentPiece = this.pieces.RING;
            else
                this.currentPiece = this.pieces.DISK;

            //Get available place plays
            if(this.availablePlays == null){
                var self=this;
                this.getAllPlacePiece(this.currentBoard, this.currentPlayer, this.currentPiece, function(plays) {
                   self.availablePlays = JSON.parse(plays);
                });
            }

            if(this.availablePlays == null || this.availablePlays.length == 0){
                console.log('Oops, something went wrong, no available plays.');
                return;
            }

            //Hightlights
            for(var i = 0; i < this.availablePlays.length; i++){
                var idTile = this.getTileIDByBoardCoords(this.availablePlays[i][0], this.availablePlays[i][1]);
                this.scene.currentBoard.tiles[idTile - 1].highlight();
                console.log("hilighting");
            }
            this.scene.auxiliaryBoard.tiles[tileID - 49].highlight();

            //Advance to next state
            if(this.lastPick == null)
                this.lastPick = tileID;
            else this.lastPick = this.currentPick;

            this.currentPick = tileID;
            this.nextState();
            break;

        case 'PICK_PLACE_TARGET':
            if(tileID == this.currentPick){
                this.scene.auxiliaryBoard.tiles[this.currentPick - 49].lowlight();
                for(var i = 0; i < this.scene.currentBoard.tiles.length; i++){
                    this.scene.currentBoard.tiles[i].lowlight();
                }
                this.availablePlays = null;
                this.gameState = this.gameStates.PICK_PLACE_PIECE;
                return;
            }
            if(tileID >= 49) {
                console.log('Pick a field to place the piece');
                return;
            }

            var boardCoords = this.getBoardCoordsByTileID(tileID);

            //Find piece in array
            var found = false;
            for(var i = 0; i < this.availablePlays.length; i++) {
                if (boardCoords.x == this.availablePlays[i][0] && boardCoords.y == this.availablePlays[i][1]) {
                    found = true;
                    break;
                }
            }
            if(!found){
                console.log('That field isnt possible');
                return;
            }

            //Do play
            var self = this;
            this.placePiece(this.currentBoard, this.currentPlayer, this.currentPiece, boardCoords.x, boardCoords.y, function(board) {
                self.currentBoard = board;
            });

            this.scene.auxiliaryBoard.moveToTile(this.currentPick, tileID);

            //Highlights
            this.scene.auxiliaryBoard.tiles[this.currentPick - 49].lowlight();
            for(var i = 0; i < this.scene.currentBoard.tiles.length; i++){
                this.scene.currentBoard.tiles[i].lowlight();
            }

            this.scene.currentBoard.tiles[tileID].highlight();

            //Advance to next state
            this.lastPick = this.currentPick;
            this.currentPick = tileID;
            this.availablePlays = null;
            this.nextState();
            break;

        case 'PLACE_ANIMATION':
            break;

        case 'PICK_MOVE_PIECE':
            if(tileID >= 49) {
                console.log('Pick a piece on the board to move');
                return;
            }

            var boardCoords = this.getBoardCoordsByTileID(tileID);

            //Discover pawn type
            var parsedBoard = JSON.parse(this.currentBoard);

            var ringSlot = parsedBoard[boardCoords.y - 1][boardCoords.x - 1][0];
            var diskSlot = parsedBoard[boardCoords.y - 1][boardCoords.x - 1][1];

            if(ringSlot == 0 && diskSlot == 0){
                console.log('Tile is empty.');
                return;
            }
            if(ringSlot > 0 && diskSlot > 0) {
                console.log('Tile is full and cannot be moved!');
                return;
            }

            //OR binarios OP
            var piece = (ringSlot | diskSlot);
            if(piece % 2)
                this.currentPiece = this.pieces.RING;
            else
                this.currentPiece = this.pieces.DISK;


            var self = this;
            this.getAllMovePiece(this.currentBoard, this.currentPlayer, this.currentPiece, boardCoords.x, boardCoords.y, function (plays) {
                self.availablePlays = JSON.parse(plays);
            });

            if(this.availablePlays.length == 0 || this.availablePlays == null){
                console.log('No plays for that tile');
                this.availablePlays = null;
                return;
            }

            //Highlights
            for(var i = 0; i < this.availablePlays.length; i++){
                var idTile = this.getTileIDByBoardCoords(this.availablePlays[i][0], this.availablePlays[i][1]);
                this.scene.currentBoard.tiles[idTile - 1].highlight();
            }

            //Advance to next state
            if(this.lastPick == null)
                this.lastPick = tileID;
            else this.lastPick = this.currentPick;
            this.currentPick = tileID;
            this.gameState = this.gameStates.PICK_MOVE_TARGET;
            break;

        case 'PICK_MOVE_TARGET':
            if(tileID == this.currentPick){
                this.gameState = this.gameStates.PICK_MOVE_PIECE;
                for(var i = 0; i < this.scene.currentBoard.tiles.length; i++){
                    this.scene.currentBoard.tiles[i].lowlight();
                }
                this.availablePlays = null;
                return;
            }
            if(tileID >= 49) {
                console.log('Pick a field to move the piece to');
                return;
            }

            var boardCoords = this.getBoardCoordsByTileID(tileID);

            //Find piece in array
            var found = false;
            for(var i = 0; i < this.availablePlays.length; i++) {
                if (boardCoords.x == this.availablePlays[i][0] && boardCoords.y == this.availablePlays[i][1]) {
                    found = true;
                    break;
                }
            }
            if(!found){
                console.log('You damn fool, pick a field that is available.');
                return;
            }

            //Do play
            var lastBoardCoords = this.getBoardCoordsByTileID(this.currentPick);
            var self = this;
            this.movePiece(this.currentBoard, this.currentPlayer, this.currentPiece, lastBoardCoords.x, lastBoardCoords.y, boardCoords.x, boardCoords.y, function(board) {
                self.currentBoard = board;
            });

            this.scene.currentBoard.moveToTile(this.currentPick, tileID);

            //Highlights
            for(var i = 0; i < this.scene.currentBoard.tiles.length; i++){
                this.scene.currentBoard.tiles[i].lowlight();
            }
            this.scene.currentBoard.tiles[tileID].highlight();

            //Advance to next state
            this.lastPick = this.currentPick;
            this.currentPick = tileID;
            this.availablePlays = null;

            this.nextState();
            break;

        case 'MOVE_ANIMATION':
            break;
        default:
            console.log('No Game State');
            break;
    }
};

GameEngine.prototype.undo = function() {
    console.log("undo");
};

GameEngine.prototype.nextState = function(){
    switch(this.gameState){
        case 'PICK_PLACE_PIECE':
            this.gameState = this.gameStates.PICK_PLACE_TARGET;
            break;
        case 'PICK_PLACE_TARGET':
            this.gameState = this.gameStates.PLACE_ANIMATION;
            break;
        case 'PLACE_ANIMATION':
            this.scene.currentBoard.tiles[this.currentPick].lowlight();
            this.gameState = this.gameStates.PICK_MOVE_PIECE;
            break;
        case 'PICK_MOVE_PIECE':
            this.gameState = this.gameStates.PICK_MOVE_TARGET;
            break;
        case 'PICK_MOVE_TARGET':
            this.gameState = this.gameStates.MOVE_ANIMATION;
            break;
        case 'MOVE_ANIMATION':
            this.scene.currentBoard.tiles[this.currentPick].lowlight();
            this.currentPlayer = 1 - this.currentPlayer;
            this.gameState = this.gameStates.PICK_PLACE_PIECE;
            break;
    }

    this.canUndo = true;
};
GameEngine.prototype.getTileIDByBoardCoords = function(x, y) {
    var tileID = y * 7  - 7;
    tileID += x;

    return tileID;
}
GameEngine.prototype.getBoardCoordsByTileID = function(tileID) {
    var x = (tileID % 7) + 1;
    var y = Math.floor(tileID / 7) + 1;

    return new MyCoordinate(x, y);

};
GameEngine.prototype.initialize = function(callback) {
    getPrologRequest("createBoard", function(data) {
       
        board = data.target.response;
        callback(board);
    }, true);

}

GameEngine.prototype.placePiece = function(board, player, pawn, x, y, callback) {

    getPrologRequest("placePiece(" + board + "," + player + "," + pawn + "," + x + "," + y + ")", function(data) {

        
        var b1 = data.target.response;

        callback(b1);
    });
}
;


GameEngine.prototype.movePiece = function(board, player, pawn, xi, yi, xf, yf, callback) {

    getPrologRequest("movePiece(" + board + "," + player + "," + pawn + "," + xi + "," + yi + "," + xf + "," + yf + ")", function(data) {

        
        var b1 = data.target.response;

        callback(b1);
    });

};

//mode (0 -> PLACE / 1 -> MOVE)
GameEngine.prototype.validatePlay = function(board, player,pawn, xi, yi, xf, yf, mode, callback) {

    getPrologRequest("validatePlay(" + board + "," + player + "," + xi + "," + yi + "," + xf + "," + yf + "," + mode + "," + pawn + ")", function(data) {
       
        var t1 = data.target.response;
        //console.log(t1);
        var t2;
        if (t1 == "1")
            t2 = true;
        if (t1 == "0")
            t2 = false;

        callback(t2);
    });
};

GameEngine.prototype.isMovable = function(board, x, y, callback) {

    console.log("isMovable(" + board + "," + x + "," + y + ")");
    getPrologRequest("isMovable(" + board + "," + x + "," + y + ")", function(data) {
        var t1 = data.target.response;
        console.log(t1);
        var t2;
        if (t1 == "1")
            t2 = true;
        if (t1 == "0")
            t2 = false;

        callback(t2);
    });
};


//mode (0 -> PLACE / 1 -> MOVE)
GameEngine.prototype.getAllPlacePiece = function(board, player,pawn, callback){
    getPrologRequest("getAllPlacePiece("+board+","+player+","+pawn+")", function(data){
        var plays = data.target.response;
        callback(plays);
    });

};

GameEngine.prototype.getAllMovePiece = function(board, player,pawn,xi,yi, callback){
    getPrologRequest("getAllMovePiece("+board+","+player+","+xi+","+yi+","+pawn+")", function(data){
        var plays = data.target.response;
        callback(plays);
    });

};

GameEngine.prototype.botMovePiece=function(board,player,pawn,callback){
    getPrologRequest("botMovePiece("+board+","+player+","+pawn+")", function(data){
        var plays = data.target.response;
        callback(plays);
    });
};



