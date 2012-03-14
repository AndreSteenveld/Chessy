define( [ "..", ".", "lib", "../Player" ], function( chess, ai, lib, Player ){

	ai.Random = lib.declare( [ Player ], {
	
		//
		// Actions involving the other player
		//			
		acceptDraw: function( ){ /* called when the other player offers a draw. Returns true to accept, false to reject */ },
		
		//
		// Game actions
		//
		lose: function( ){ /* Called when the player loses */ },
		
		draw: function( ){ /* Called when the players have agreed on a draw */ },
		
		win: function( ){ /* Called when the player wins the game */ },
		
		//
		// Game event handlers
		//
		turn: function( ){ 
			/* when this player recieves the turn */ 
			
			var pieces  = this.board[ this.color + "PiecesInPlay" ],
				checked = this.board.isCheck( this.color );
				
			var piece = checked
					? pieces.filter( function( piece ){ return piece.type === "King"; } )[ 0 ]
					: pieces[ ~~( Math.random( ) * pieces.length - 1 ) ];
					
			var moves = piece.moves( );
					
			while( true ){
				if( checked && !moves.length ){
					// We are checked and there are no moves, just give up!
					this.surrender( );
					break;	
				}
				
				if( moves.length ){
					var move = moves[ ~~( Math.random( ) * moves.length - 1 ) ];
					
					piece.move( move );
					break;
				}
					
				piece = pieces[ ~~( Math.random( ) * pieces.length - 1 ) ];
				moves = piece.moves( );
			}			
			
		},
		
		placed: function( ){ /* when a piece has been placed on the board */ },
		
		moved: function( ){ /* when any player has moved a piece */ },
		
		started: function( ){ /* when the game has started */ },
		
		checked: function( ){ /* Called when the other player checked you */ },
		
		mates: function( ){ /* Called when the other player mates you */ },
		
		staleMates: function( ){ /* Called when you are stale mated */ },
		
		ended: function( ){ /* called when the game comes to an end */ }
	
	});
	
	return ai.Random;

});