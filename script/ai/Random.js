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
			onStarted: function( ){ /* when the game has started */ },
			
			onEnd: function( ){ /* called when the game comes to an end */ },
			
			onLose: function( ){ /* Called when the player loses */ },
			
			onDraw: function( ){ /* Called when the players have agreed on a draw */ },
			
			onWin: function( ){ /* Called when the player wins the game */ },
			
			//
			// Actions involving the other player
			//		
			acceptDraw: function( deferred ){ deferred.resolve( true ); /* called when the other player offers a draw. Returns true to accept, false to reject */ },
			
			//
			// Game event handlers
			//
			onTurn: function( ){
				
				this.inherited( arguments );
				
				if( this.board.isCheck( this.color ) ){
					
					return this.surrender( );
						
				}
				
				var pieces = this.board[ this.color ].pieces,
					piece  = null;
					
				while( !piece || !piece.moves( ).length ){	
					
					piece = pieces[ Math.floor( Math.random( ) * pieces.length ) ];
					
				}
				
				var fields = piece.moves( ),
					field  = fields[ Math.floor( Math.random( ) * fields.length ) ];
					
				piece.move( field );
				
			},
			
			onPlaced: function( ){ /* when a piece has been placed on the board */ },
			
			onMoved: function( ){ /* when any player has moved a piece */ },
			
			//
			// Handlers for events after something happend to the player
			//
			onCheck: function( ){ /* this.surrender( ); */ },
			
			onCheckMate: function( ){ /* Called when the other player mates you */ },
			
			onStaleMate: function( ){ /* Called when you are stale mated */ }
		
		});	
	
	return ai.Random;

});