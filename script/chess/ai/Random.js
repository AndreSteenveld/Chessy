/*
 *	Copyright (C) 2012 André jr Steenveld all rights reserved
 *	Licensed under the MIT public license for the full license see the LICENSE file
 *
 */
define( [ "..", ".", "lib", "../Player" ], function( chess, ai, lib, Player ){

	ai.Random = lib.declare( [ Player ], {
		
			//
			// Handlers for general game events
			//
			started: function( ){ /* when the game has started */ },
			
			ended: function( ){ /* called when the game comes to an end */ },
			
			lose: function( ){ /* Called when the player loses */ },
			
			draw: function( ){ /* Called when the players have agreed on a draw */ },
			
			win: function( ){ /* Called when the player wins the game */ },
			
			//
			// Actions involving the other player
			//		
			acceptDraw: function( deferred ){ deferred.resolve( true ); /* called when the other player offers a draw. Returns true to accept, false to reject */ },
			
			//
			// Game event handlers
			//
			turn: function( ){ 
				
				var pieces = this.board[ this.color ].pieces,
					piece  = null;
					
				while( !piece || !piece.moves( ).length ){	
					
					piece = pieces[ ~~( Math.random( ) * pieces.length - 1 ) ];
					
				}
				
				var fields = piece.moves( ),
					field  = fields[ ~~( Math.random( ) * fields.length - 1 ) ];
					
				piece.move( field );
				
			},
			
			placed: function( ){ /* when a piece has been placed on the board */ },
			
			moved: function( ){ /* when any player has moved a piece */ },
			
			//
			// Handlers for events after something happend to the player
			//
			check: function( ){ this.surrender( ); },
			
			mate: function( ){ /* Called when the other player mates you */ },
			
			staleMate: function( ){ /* Called when you are stale mated */ }
		
		});	
	
	return ai.Random;

});