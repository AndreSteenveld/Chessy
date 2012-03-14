define([ "../", "lib", "doh" ], function( chess, lib, doh ){

function wrap_tests( tests ){

	Object.keys( tests ).forEach( function( key ){
	
		lib.aspect.before( tests, key, function( ){
			return [ new chess.board.Board({ }), { } ];		
		});
		
	});
	
	return tests;
}

var Piece = lib.declare( [ chess.pieces.Piece ], {
	
	type: "Piece",
	
	movement: function( ){
		return this.inherited( arguments, [[
			
			[ this.x, this.y + 1 ]
			
		]]);		
	}
	
});

doh.register(
	
	"Piece movement",
	
	wrap_tests({
	
		move_piece: function( board, pieces ){			
			pieces.piece = new Piece({
				color: "white",
				board: board,
				field: board.fields.d4
			});
			
			doh.is( true, pieces.piece === board.fields.d4.piece, "Piece is not at the D4" );
			
			pieces.piece.move( board.fields.d5 );
			
			doh.is( false, pieces.piece === board.fields.d4.piece, "Piece is still at D4" );
			doh.is( true,  pieces.piece === board.fields.d5.piece, "Piece is not at D5" );
		},
		
		taking_piece: function( board, pieces ){
			pieces.white = new Piece({
				color: "white",
				board: board,
				field: board.fields.d4
			});
			
			pieces.black = new Piece({
				color: "black",
				board: board,
				field: board.fields.d5
			});
			
			doh.is( 2, board.piecesInPlay.length, "There are [ " + board.piecesInPlay.length + " ] in play." );
			
			pieces.white.move( board.fields.d5 );
			
			doh.is( false, pieces.black === board.fields.d5.piece, "The piece is still the black piece" );
			doh.is( true,  pieces.white === board.fields.d5.piece, "It's not the white piece on D5" );
			
			doh.is( false, pieces.black.inPlay, "Black piece is still in play" );
			doh.is( null,  pieces.black.field,  "Black piece is still on a field" );
			
			doh.is( 1, board.piecesInPlay.length, "There are still [ " + board.piecesInPlay.length + " ] in play" );
			doh.is( 1, board.piecesOutOfPlay.length, "There are [ " + board.piecesOutOfPlay.length + " ] out of play" );
		},
		
		pawn_promotion: function( board, pieces ){
			
			throw "Test not implementd";
			
		}
	})
);


});