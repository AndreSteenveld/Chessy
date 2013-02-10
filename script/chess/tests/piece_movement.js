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
			
			doh.is( true, pieces.piece.move( board.fields.d5 ), "The move was unsuccessfull" );
			
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
			
			doh.is( true, pieces.white.move( board.fields.d5 ), "The move was not successfull" );
			
			doh.is( false, pieces.black === board.fields.d5.piece, "The piece is still the black piece" );
			doh.is( true,  pieces.white === board.fields.d5.piece, "It's not the white piece on D5" );
			
			doh.is( false, pieces.black.inPlay, "Black piece is still in play" );
			doh.is( null,  pieces.black.field,  "Black piece is still on a field" );
			
			doh.is( 1, board.piecesInPlay.length, "There are still [ " + board.piecesInPlay.length + " ] in play" );
			doh.is( 1, board.piecesOutOfPlay.length, "There are [ " + board.piecesOutOfPlay.length + " ] out of play" );
		},
		
		illegal_move: function( board, pieces ){
			pieces.piece = new Piece({
				color: "white",
				board: board,
				field: board.fields.d4
			});
			
			doh.is( false, pieces.piece.move( board.fields.d6 ), "It was possible to make an illegal move" );			
			
		},
		
		pawn_moveing_into_en_passant: function( board, pieces ){
			
			pieces.bPawn = new chess.pieces.Pawn({
				color: "black",
				board: board,
				field: board.fields.a7
			});
			
			pieces.wPawn = new chess.pieces.Pawn({
				color: "white",
				board: board,
				field: board.fields.b5
			});
			
			doh.is( true, pieces.bPawn.move( board.fields.a5 ), "The move was unsuccessfull" );
			
			doh.t( -1 !== pieces.bPawn.attackedBy( ).indexOf( pieces.wPawn ), "Black pawn is not being attacked by white pawn." );
			doh.t( -1 !== pieces.wPawn.moves( ).indexOf( board.fields.a6 ), "White pawn can't move to A6." );
			
		},
		
		pawn_looking_at_en_passant_but_not_moving: function( board, pieces ){
			
			pieces.bPawn = new chess.pieces.Pawn({
				color: "black",
				board: board,
				field: board.fields.a7
			});
			
			pieces.notEnPassant = new chess.pieces.Pawn({
				color: "black",
				board: board,
				field: board.fields.h7
			});
			
			pieces.wPawn = new chess.pieces.Pawn({
				color: "white",
				board: board,
				field: board.fields.b5
			});
			
			// Ok we are going to look if we can move in to an en passant situation, I think
			// there is a little bug that assigns the moves before actually moving the pawn.
			pieces.bPawn.moves( );
			
			doh.is( true, pieces.notEnPassant.move( board.fields.h6 ), "The move of the non en passant pawn didn't move" );
			
			doh.t( -1 === pieces.bPawn.attackedBy( ).indexOf( pieces.wPawn ), "Black pawn is being attacked by white pawn." );
			doh.t( -1 === pieces.wPawn.moves( ).indexOf( board.fields.a6 ), "White pawn can move to A6." );
				
		},
		
		king_castleing_left: function( board, pieces ){
					
			pieces.king = new chess.pieces.King({ 
				color: "white", 
				board: board,
				field: board.fields.e1
			});
			
			pieces.rook = new chess.pieces.Rook({ 
				color: "white",
				board: board,
				field: board.fields.a1
			});
	
			doh.is( true, pieces.king.move( board.fields.c1 ), "Castleing move failed" );
			
			// Make sure the pieces have moved
			doh.is( true, null === board.fields.a1.piece, "The castle hasn't moved" );
			doh.is( true, null === board.fields.e1.piece, "The king hasn't moved" );
			
			// Make sure they are occupying the correct fields
			doh.is( true, board.fields.c1.piece === pieces.king, "The king is not occupying c1" );
			doh.is( true, board.fields.d1.piece === pieces.rook, "The rook is not occupying d1" );
			
			// Make sure the pieces know what field they are occupying
			doh.is( true, board.fields.c1 === pieces.king.field, "King doesn't know what field he is occupying" );
			doh.is( true, board.fields.d1 === pieces.rook.field, "Rook doesn't know what field he is occupying" );
			
		},
		
		king_castleing_right: function( board, pieces ){
			
			pieces.king = new chess.pieces.King({ 
				color: "white", 
				board: board,
				field: board.fields.e1
			});
			
			pieces.rook = new chess.pieces.Rook({ 
				color: "white",
				board: board,
				field: board.fields.h1				
			});
	
			doh.is( true, pieces.king.move( board.fields.g1 ), "Castleing move failed" );
			
			// Make sure the pieces have moved
			doh.is( true, null === board.fields.h1.piece, "The castle hasn't moved" );
			doh.is( true, null === board.fields.e1.piece, "The king hasn't moved" );
						
			// Make sure they are occupying the correct fields
			doh.is( true, board.fields.g1.piece === pieces.king, "The king is not occupying g1" );
			doh.is( true, board.fields.f1.piece === pieces.rook, "The rook is not occupying f1" );
			
			// Make sure the pieces know what field they are occupying
			doh.is( true, board.fields.g1 === pieces.king.field, "King doesn't know what field he is occupying" );
			doh.is( true, board.fields.f1 === pieces.rook.field, "Rook doesn't know what field he is occupying" );
			
		},
		
		king_not_castlering_because_it_already_did: function( board, pieces ){
			
			pieces.king = new chess.pieces.King({
				color: "white",
				board: board,
				castled: true,
				field: board.fields.e1
			});
			
			pieces.rook_left = new chess.pieces.Rook({
				color: "white",
				board: board,
				field: board.fields.a1
			});
			
			pieces.rook_right = new chess.pieces.Rook({
				color: "white",
				board: board,
				field: board.fields.h8
			});
			
			var moves = pieces.king.moves( );
			
			doh.t( -1 === moves.indexOf( board.fields.c1 ) );
			doh.t( -1 === moves.indexOf( board.fields.g1 ) );
		},
		
		king_not_moving_to_an_attacked_field: function( board, pieces ){
						
			pieces.king = new chess.pieces.King({ 
				color: "white", 
				board: board,
				field: board.fields.a1
			});
			
			pieces.rook = new chess.pieces.Rook({ 
				color: "black",
				board: board,
				field: board.fields.b8				
			});
			
			doh.is( false, pieces.king.move( board.fields.b1 ), "King moved to an attacked field" );
			
		},
		
		king_cant_move: function( board, pieces ){
			
			pieces.king = new chess.pieces.King({ 
				color: "white", 
				board: board,
				field: board.fields.a1
			});
			
			pieces.rook = new chess.pieces.Rook({ 
				color: "black",
				board: board,
				field: board.fields.b8				
			});
			
			pieces.rook = new chess.pieces.Rook({
				color: "black",
				board: board,
				field: board.fields.h2
			});
			
			doh.is( false, pieces.king.move( board.fields.b1 ), "King moved to B1" );
			doh.is( false, pieces.king.move( board.fields.a2 ), "King moved to A2" );
			doh.is( false, pieces.king.move( board.fields.b2 ), "King moved to B2 ");
			
			doh.is( 0, pieces.king.moves( ).length, "The king has moves to make" );			
		},
		
		moving_a_rook_on_an_empty_board: function( board, pieces ){
			
			var rook = new chess.pieces.Rook({ board: board, color: "white", field: board.fields.h8 });
			
			doh.t(
				rook.movement( ).every( function( field ){ 
					return field === board.fields.h7
						|| field === board.fields.h6
						|| field === board.fields.h5
						|| field === board.fields.h4
						|| field === board.fields.h3
						|| field === board.fields.h2
						|| field === board.fields.h1
						|| field === board.fields.a8
						|| field === board.fields.b8
						|| field === board.fields.c8
						|| field === board.fields.d8
						|| field === board.fields.e8
						|| field === board.fields.f8
						|| field === board.fields.g8;
				}),
				"The rook is not looking at all the fields current fields"
			);
				
			doh.t( rook.move( board.fields.h1 ), "Moving the rook failed" );
			
			doh.t(
				rook.movement( ).every( function( field ){ 
					return field === board.fields.h7
						|| field === board.fields.h6
						|| field === board.fields.h5
						|| field === board.fields.h4
						|| field === board.fields.h3
						|| field === board.fields.h2
						|| field === board.fields.h8
						|| field === board.fields.a1
						|| field === board.fields.b1
						|| field === board.fields.c1
						|| field === board.fields.d1
						|| field === board.fields.e1
						|| field === board.fields.f1
						|| field === board.fields.g1;
				}),
				"The rook is not looking at all the new fields"
			);			
			
		},
		
		moving_a_rook_to_attack_a_pawn: function( board, pieces ){
			
			var rook = new chess.pieces.Rook({ board: board, color: "white", field: board.fields.h8 }),
				pawn = new chess.pieces.Pawn({ board: board, color: "black", field: board.fields.a1 });
			
			var isLooking = function( piece, field ){ 
				var result = -1 !== field.looking.indexOf( piece ); 
			
				!result && console.error( piece.toString( ) + " is not lookint at :: ", field );
				
				return result;				
			};
			
			doh.t( 
				[
					board.fields.h7,
					board.fields.h6,
					board.fields.h5,
					board.fields.h4,
					board.fields.h3,
					board.fields.h2,
					board.fields.h1,
					board.fields.a8,
					board.fields.b8,
					board.fields.c8,
					board.fields.d8,
					board.fields.e8,
					board.fields.f8,
					board.fields.g8
				].every( isLooking.bind( null, rook ) ),
				"The rook is not looking at all the fields cuurent fields"
			);
			
			doh.t( rook.move( board.fields.h1 ), "Moving the rook failed" );
			
			console.log( rook.movement( ).map( function( f ){ return f.toString( ); } ) );
			console.log( board.toString( ) );
			
			doh.t(
				[
					board.fields.h7,
					board.fields.h6,
					board.fields.h5,
					board.fields.h4,
					board.fields.h3,
					board.fields.h2,
					board.fields.h8,
					board.fields.a1,
					board.fields.b1,
					board.fields.c1,
					board.fields.d1,
					board.fields.e1,
					board.fields.f1,
					board.fields.g1
				].every( isLooking.bind( null, rook ) ),
				"The rook is not looking at all the new fields"
			);
			
			doh.t(
				rook.movement( ).some( function( field ){ return field === board.fields.a1; } ),
				"The rook isn't looking at A1"			
			);
		
			doh.t(
				rook.attacks( ).some( function( field ){ return field === board.fields.a1; } ),
				"The rook isn't attacking a1" 
			);
		
			console.log( board.toString( ) );
		
			doh.t( pawn.attackedBy( )[ 0 ] && pawn.attackedBy( )[ 0 ] === rook, "Pawn wasn't being attacked" );
		},
		
		move_must_cancel_check: function( board, pieces ){
			
			var king = new chess.pieces.King({ board: board, color: "white", field: board.fields.a1 }),
				pawn = new chess.pieces.Pawn({ board: board, color: "white", field: board.fields.e2 }),
				
				queen = new chess.pieces.Queen({ board: board, color: "black", field: board.fields.a8 });
				
			doh.t( board.isCheck( "white" ), "White should be check" );
			
			doh.f( pawn.move( board.fields.e3 ), "Moving the pawn won't fix the check situation" );
						
			doh.t( pawn === board.fields.e2.piece, "The pawn has moved even though the move was illegal" );
			
			doh.t( board.isCheck( "white" ), "White should still be check after the failed move" );
			
		}
	})
);


});