/*
 *	Copyright (C) 2012 André jr Steenveld all rights reserved
 *	Licensed under the MIT public license for the full license see the LICENSE file
 *
 */
define([ "chess", "lib", "doh" ], function( chess, lib, doh ){

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
	
		field_orientation: function( board ){
			
			// Normal fields
			doh.t( board.fields[ 0 ][ 0 ] === board.fields.a1, "South west is not A1" );
			doh.t( board.fields[ 0 ][ 7 ] === board.fields.a8, "North west is not A8" );
			doh.t( board.fields[ 7 ][ 0 ] === board.fields.h1, "South east is not H1" );
			doh.t( board.fields[ 7 ][ 7 ] === board.fields.h8, "North east is not H8" );
			
			// Color specific boards
			doh.t( board.white[ 0 ][ 0 ] === board.fields.a1, "White - South west is not A1" );
			doh.t( board.white[ 0 ][ 7 ] === board.fields.a8, "White - North west is not A8" );
			doh.t( board.white[ 7 ][ 0 ] === board.fields.h1, "White - South east is not H1" );
			doh.t( board.white[ 7 ][ 7 ] === board.fields.h8, "White - North east is not H8" );
			
			doh.t( board.black[ 0 ][ 0 ] === board.fields.h8, "Black - South west is not H8" );
			doh.t( board.black[ 0 ][ 7 ] === board.fields.h1, "Black - North west is not H1" );
			doh.t( board.black[ 7 ][ 0 ] === board.fields.a8, "Black - South east is not A8" );
			doh.t( board.black[ 7 ][ 7 ] === board.fields.a1, "Black - North east is not A1" );
			
		},
	
		check: function( board, pieces ){ 
			new chess.pieces.King({ color: "white", board: board, field: board.fields.a1 });
			new chess.pieces.Rook({ color: "black", board: board, field: board.fields.h1 });
				
			doh.t( board.isCheck( "white" ) );			
		},
		
		check_mate: function( board, pieces ){ 
			new chess.pieces.King({ color: "white", board: board, field: board.fields.a1 });

			new chess.pieces.Rook({ color: "black", board: board, field: board.fields.c2 });
			new chess.pieces.Rook({ color: "black", board: board, field: board.fields.c1 });
			
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