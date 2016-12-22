/**
 * MyBoard
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

function MyBoard(id, scene) {};

MyBoard.prototype = Object.create(MyLeaf.prototype);
MyBoard.prototype.constructor = MyBoard;

MyBoard.prototype.initBuffers = function() {
    
};
