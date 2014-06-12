/*
 *	Copyright (C) 2012 André jr Steenveld all rights reserved
 *	Licensed under the MIT public license for the full license see the LICENSE file
 *
 */
var Compose      = require( "compose" ),
    RSVP         = require( "rsvp" ),
    Promise      = require( "rsvp" ).Promise;
    
var EventEmitter = require( "./util/AsyncEventEmitter" ),
    Player       = require( "./Player" );
        
function placeHandler( field, piece ){ 
    this.emit( "onPlaced", {
   		field: field,
   		piece: piece
    });
}

function moveHandler( game, piece, move ){
	
	return function( toField ){
		
		var occupant = toField.piece || null,
			field    = piece.field;
		
		if( move.call( piece, toField ) ){
			
			var _moved_  = {
					counter:  game.counter++,
					color:    game.color,
					occupant: occupant,       // The current puece on the field
					piece:    piece,          // The piece we are moving
					from:     field,          // Where did the moving piece come from
					to:       toField         // Where are we going?
				};

			if( piece.type === "Pawn" && piece.y === 7 ){
			    
			    var _promotion_ = Object.create( _moved_ );
			    
			    _promotion_.color = piece.color;
			    
			    game.emit( "onPromotion", _promotion_ )
			        .then( game.emit.bind( game, "onMoved", _moved_ ) );
			        
			} else {
			    
			    game.emit( "onMoved", _moved_ );
			
		    }
								
			return true;
			
		} else {
		
			game.emit( "onIllegalMove", {
				counter: game.counter,
				piece: piece,
				color: game.color,
				from: field,
				to: toField						
			});
			
			return false;	 
			
		}			
		
	};
	
}
   
module.exports = Compose(
    
    EventEmitter,
    
    function( _game_ ){
		var board = this.board = _game_.board;
				
		Compose.after( placeHandler.bind( this ) ).install.call( board, "place" );
				
		board.piecesInPlay.forEach( 
		    function( piece ){
		    
		        Compose.around( moveHandler.bind( null, this, piece ) ).install.call( piece, "move" );
		        
		    }
		    , this
		);
					
		"white" in _game_ && _game_.white.join( this, "white" );
		"black" in _game_ && _game_.black.join( this, "black" );			
		
		"color" in _game_ && ( this.color = _game_.color );
	},
    
    {
    
        counter: 0,
		
		color: null,
		
		board: null,
		
		white: null,
		black: null,    

        turn: function( ){ 
			return this.color && this.color === "white"
				? ( this.color = "black" )
				: ( this.color = "white" );	
		},
		
		start: function( ){
			if(
				   this.white && this.white instanceof Player 
				&& this.black && this.black instanceof Player
			){
				// Flip the color, hackish but effective
				!this.color || this.color === "white"
					? ( this.color = "white" )
					: ( this.color = "black" );
					
				this.onStart({ color: this.color });
				
			} else {
				
				console.warn( "Game#start :: Not enough players to start the game" );
				
			}
		},
		
		end: function( conditions ){
			
			conditions.result === "Surrender"
			    && this.onSurrender( conditions );
		},
		
		draw: function( ){
			
			
		},
		
		//
		// Handlers for the place and occupy methods from the board
		//
		
		dispatch: function( single ){
		
		    if( !single ){
		        
		        var target = this[ arguments[ 2 ].color || arguments[ 2 ].loser ];
		        
		        return target.emit.apply( target, Array.prototype.slice.call( arguments, 1 ) );
		        
		    } else {
		    
		        return RSVP.all([
		            this.white.emit.apply( this.white, Array.prototype.slice.call( arguments, 1 ) ),
		            this.black.emit.apply( this.black, Array.prototype.slice.call( arguments, 1 ) )
		        ]);    
		        
		    }
		    
		},
		
		//
		// Game events
		//
		onPlaced: function( _placed_ ){ /* When a piece is placed on the board (setup or pawn promotion) */ 
			return this.dispatch( true, "onPlaced", _placed_ );
		},
				
		onMoved: function( _moved_ ){ 
						
			var color = this.turn( ),
				turn  = color === "white" ? "black" : "white",
				data  = lib.mixin( { }, _moved_ );

            var dispatched = this.dispatch( true, "onMoved", _moved_ );

			// 
			// We do want to make sure that the check event is triggered befire the
			// actual turn event. This is becuase a player has to know he is check
			// before considering any moves. Using the deferred returned from the 
			// onIdle will gurantee that.
			//
			if( !this.board.isCheck( turn ) && this.board.isStaleMate( turn ) ){
			
			    return dispatched
			        .then( this.onStaleMate.bind( this, { result: "StaleMate" } ) );
								
			} else if( !this.board.isCheckMate( turn ) && this.board.isCheck( turn ) ){
		
				return dispatched
					.then( this.onCheck.bind( this, data ) )
					.then( this.onTurn.bind( this, data ) );
			
			} else if( this.board.isCheckMate( turn ) ){
					
				return dispatched
					.then( 
						this.onCheckMate.bind( this, 
							{ 
								result: "CheckMate", 
									
								winner: color,
								loser:  turn 
							}
						) 
					);
							
			} else {
								
				return dispatched
					.then( this.onTurn.bind( this, data ) );
				
			}
				
		},
		
		onIllegalMove: function( _illegal_ ){ /* When a player makes an illegal move */ 
			return this.dispatch( false, "onIllegalMove", _illegal_ );
		},
			
		onTurn: function( _turn_ ){ // The event that is triggered when te turn is passed to the other player
			return this.dispatch( false, "onTurn", _turn_ );
		},
		
		onPromotion: function( _turn_ ){ // When a promotion has happended on the board
			return this.dispatch( false, "onPromotion", _turn_ );
		},
						
		onCheck: function( _turn_ ){ /* Fired when any player is checked */ 
			return this.dispatch( false, "onCheck", _turn_ );
		},
		
		onStaleMate: function( _result_ ){ /* Fired when there is a stale mate, fired before the onEnd event */ 
			return this.dispatch( true, "onStaleMate", _result_ )
				.then( this.onDraw.bind( this, _result_ ) );	
		},
		
		onCheckMate: function( _result_ ){ /* Fired when eiter player is mated, fired before the onEnd event */ 
			return this.dispatch( false, "onCheckMate", _result_ )
				.then( this.onEnd.bind( this, _result_ ) );	
		},
		
		onSurrender: function( _result_ ){ /* Fired when a player surrenders the match, fired before the onEnd event */ 
			return this.dispatch( true, "onSurrender", _result_ )
				.then( this.onEnd.bind( this, _result_ ) );
		},
						
		onStart: function( _start_ ){ 
			
			return this.dispatch( true, "onStart", _start_ )
				.then( 
				    this.onMoved.bind( this, { counter: this.counter++, color: _start_.color } )
				);	
			
		},
		
		onDraw: function( _result_ ){ /* Fired when a game ended in a draw, fired before the onEnd event */ 
			this.dispatch( true, "onDraw", _result_ )
				.then( this.onEnd.bind( this, _result_ ) );
		},
		
		onEnd: function( _result_ ){ /* Fired when the game has eneded */ 
						
			if( _result_.result === "Draw" || _result_.result === "StaleMate" ){
			
				return this.dispatch( true, "onEnd", _result_ );
				
			} else {
						
				var winner = this[ _result_.winner ],
					loser  = this[ _result_.loser ];
						
				return RSVP.all([
    					winner.emit.bind( winner, "onWin", _result_ ),
    					loser.emit.bind( loser, "onLose", _result_ )
    				])
                    .then( this.dispatch.bind( this, true, "onEnd", _result_ ) );
				
			}
			
		},
		
		onPlayerJoin: function( _joiningPlayer_ ){ /* When a player joins the game */
		    return this.emit( "onPlayerJoin", _joiningPlayer_ );
		},
		
		onPlayerLeave: function( _leavingPlayer_ ){ /* When a player leaves and the the game wasn't started */ 
		    return this.emit( "onPlayerLeave", _leavingPlayer_ );
		},
		
		//
		// Actions
		//
		join: function( player, color ){ 
			// We already have 2 players, or the preferred color is already taken...
			if( ( color && this[ color ] ) || ( this.black && this.white ) ){ 
				return null; 	
			}
			
			// Decide what color we are going to use
			color || ( color = ~~( Math.random( ) * 10 ) % 2 ? "white" : "black" );
			this[ color ] = player;
						
			this.onPlayerJoin({ color: color, player: player });
			
			return color;
		},
		
		leave: function( player ){ 
			this[ player.color ] = null;
			this.onPlayerLeave({ player: player });
		}
        
    }
    
);
