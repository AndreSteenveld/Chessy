/*
 *	Copyright (C) 2012 André jr Steenveld all rights reserved
 *	Licensed under the MIT public license for the full license see the LICENSE file
 *
 */
define([ "../", "lib", "doh" ], function( chess, lib, doh ){

function wrap_tests( tests ){

	Object.keys( tests ).forEach( function( key ){
	
		lib.aspect.before( tests, key, function( ){
			return [ new chess.board.Board({ }), { } ];		
		});
		
	});
	
	return tests;
}

doh.register(
	
	"Board checks",
	
	wrap_tests({
	
		check: function( board, pieces ){ 
			new chess.pieces.King({ color: "white", board: board, field: board.fields.a1 });
			new chess.pieces.Rook({ color: "black", board: board, field: board.fields.h1 });
				
			doh.t( board.isCheck( "white" ) );			
		},
		
		check_mate: function( board, pieces ){ 
			new chess.pieces.King({ color: "white", board: board, field: board.fields.a1 });
			new chess.pieces.Pawn({ color: "white", board: board, field: board.fields.a2 });
			
			new chess.pieces.Queen({ color: "white", board: board, field: board.fields.c1 });
			
			doh.t( board.isCheckMate( "white" ) );
			
		},
		
		stale_mate: function( board, pieces ){ 
			new chess.pieces.King({ color: "white", board: board, field: board.fields.a1 });
			new chess.pieces.Pawn({ color: "white", board: board, field: board.fields.a2 });
				
			new chess.pieces.Pawn({ color: "black", board: board, field: board.fields.a3 });
			new chess.pieces.Rook({ color: "black", board: board, field: board.fields.b8 });
				
			doh.t( board.isStaleMate( "white" ) );			
		}
		
		
	})
);


});